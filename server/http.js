const logger = require('./logger')
const http = require('http')
const path = require('path')
const fs = require('fs').promises
const WebSocket = require('ws')

class GCEHttp {
  constructor (gce) {
    this.gce = gce

    this.server = null
    this.wss = null

    this.mimeTypes = {
      '.ico': 'image/x-icon',
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    }
  }

  static async create (gce) {
    const instance = new this(gce)

    await instance.create()

    return instance
  }

  async create () {
    this.server = http.createServer(this._onRequest.bind(this))

    this.wss = new WebSocket.Server({
      server: this.server
    })

    this.wss.on('connection', ws => {
      ws.isAlive = true
      ws.on('pong', () => {
        ws.isAlive = true
      })

      ws.on('message', message => {
        logger.log('GCE HTTP', 'WS message', message)
      })

      ws.send(JSON.stringify({
        type: 'config',
        data: this.gce.config
      }))
    })

    this._setupWssPingPong()
  }

  async listen () {
    this.server.listen(this.gce.config.gce.port, () => {
      logger.info('GCE HTTP', 'Server', 'Started on port', this.gce.config.gce.port)
    })
  }

  async _onRequest (req, res) {
    try {
      let fullpath = path.normalize(req.url)
      if (fullpath === '/') {
        fullpath = '/index.html'
      }

      try {
        const stat = await fs.stat(path.join(__dirname, '../public/', fullpath))
        if (!stat.isFile()) {
          throw new Error('Not a file')
        }
      } catch (err) {
        logger.warn('GCE HTTP', req.headers.host, fullpath, err)
        fullpath = '/index.html'
      }

      logger.debug('GCE HTTP', req.headers.host, fullpath)
      const content = await fs.readFile(path.join(__dirname, '../public/', fullpath))
      const extension = path.parse(fullpath).ext
      res.writeHead(200, { 'Content-type': this.mimeTypes[extension] || 'text/plain' })
      res.end(content)
    } catch (err) {
      logger.error('GCE HTTP', req.headers.host, err)
    }
  }

  _setupWssPingPong () {
    const pingPong = setInterval(() => {
      for (const ws of this.wss.clients) {
        if (ws.isAlive === false) {
          ws.terminate()
          continue
        }

        ws.isAlive = false
        ws.ping(function () {})
      }
    }, 30000)

    this.wss.on('close', () => {
      clearInterval(pingPong)
    })
  }
}

module.exports = GCEHttp
