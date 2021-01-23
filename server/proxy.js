const logger = require('../shared/logger')
const httpProxy = require('http-proxy')
const path = require('path')
const fs = require('fs')
const WebSocket = require('ws')

class GCEProxy {
  constructor (gce, lb) {
    this.gce = gce
    this.lb = lb

    this.proxy = null
    this.serversAvailable = []

    this._serverIdMaxLength = 10

    this.mimeTypes = {
      '.ico': 'image/x-icon',
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    }

    this.gceWs = null
  }

  static async create (gce, lb) {
    const instance = new this(gce, lb)

    await instance.loadAvailableServers()
    await instance.create()

    return instance
  }

  async loadAvailableServers () {
    this.serversAvailable = [
      {
        internal: true,
        slug: 'GCE:HTTP',
        hosts: [this.gce.config.gce.host],
        ports: [],
        static: {
          path: path.join(__dirname, 'public'),
          index: 'index.html',
          fallback: path.join(__dirname, 'public', 'index.html'),
        },
        path: null,
        pathNot: null,
        roundRobinPortIndex: 0
      }
    ]

    for (const projectSlug of Object.keys(this.gce.config.projects)) {
      const project = this.gce.config.projects[projectSlug]

      for (const directorySlug of Object.keys(project.directories)) {
        const directory = project.directories[directorySlug]

        if (!directory.loadBalancer) {
          continue
        }

        for (const serverSlug of Object.keys(directory.loadBalancer)) {
          this.serversAvailable.push({
            slug: `${projectSlug}:${directorySlug}:${serverSlug}`,
            hosts: directory.loadBalancer[serverSlug].hosts,
            ports: directory.loadBalancer[serverSlug].ports,
            static: directory.loadBalancer[serverSlug].static,
            path: directory.loadBalancer[serverSlug].path || null,
            pathNot: directory.loadBalancer[serverSlug].pathNot || null,
            roundRobinPortIndex: directory.loadBalancer[serverSlug].ports.length - 1
          })
        }
      }
    }
  }

  async create () {
    this.proxy = httpProxy.createProxyServer({})

    this.proxy.on('error', function (err, req, res) {
      logger.warn('Proxy HTTP', 'Service Unavailable', err)
      if (res) {
        try {
          res.writeHead(503)
          res.write('503 Service Unavailable')
          res.end()
        } catch (e) {}
      }
    })

    this.gceWs = new WebSocket.Server({
      noServer: true
    })

    this.gceWs.on('connection', ws => {
      ws.isAlive = true
      ws.on('pong', () => {
        ws.isAlive = true
      })

      ws.on('message', async message => {
        try {
          const { type, data } = JSON.parse(message)
          await this.gce.onConnectionMessage(type, data, ws)
        } catch (err) {
          logger.warn('GCE HTTP', 'WS message', message, err)
        }
      })

      this.gce.onNewConnection(ws)
    })

    this._setupWssPingPong()
  }

  _getMatchServer (host, url) {
    const servers = this.serversAvailable.filter(function (server) {
      return (!server.hosts.length || server.hosts.includes(host)) &&
        (!server.path || url.startsWith(server.path)) &&
        (!server.pathNot || !url.startsWith(server.pathNot))
    })

    servers.sort(function (a, b) {
      return (b.path ? b.path.length : 0) - (a.path ? a.path.length : 0)
    })

    if (!servers.length) {
      return null
    }

    const server = servers[0]
    server.roundRobinPortIndex = server.ports.length ? (server.roundRobinPortIndex + 1) % server.ports.length : null

    return server
  }

  async proxyRequest (req, res) {
    const server = this._getMatchServer(req.headers.host, req.url)

    if (!server) {
      return false
    }

    if (server.static) {
      await this._proxyRequestStatic(req, res, server.static)
      logger.debug('Proxy HTTP', `${server.slug}:static`, req.url)
      return true
    }

    const port = server.ports[server.roundRobinPortIndex]
    logger.debug('Proxy HTTP', `${server.slug}:${port}`, req.url)

    this.proxy.web(req, res, {
      target: {
        host: '127.0.0.1',
        port
      },
      ssl: this.lb.serverOptions
    })

    return true
  }

  async _isFile (filepath) {
    // Don't use fs promises, they are issues with them on pkg: https://github.com/zeit/pkg/issues/455
    const stat = fs.statSync(filepath)

    // throw in case file not found

    if (!stat.isFile()) {
      return false
    }

    return true
  }

  async _tryFile (fullpath, index) {
    if (!await this._isFile(fullpath)) {
      fullpath = path.join(fullpath, path.normalize(index))

      if (!await this._isFile(fullpath)) {
        throw new Error('Not a file')
      }
    }

    return fullpath
  }

  async _proxyRequestStatic (req, res, serverStatic) {
    const url = path.normalize(req.url).split('?')[0]
    let fullpath = path.join(serverStatic.path, url)
    if (fullpath === '/' || fullpath === '\\') {
      fullpath = '/' + serverStatic.index
    }

    try {
      try {
        fullpath = await this._tryFile(fullpath, serverStatic.index)
      } catch (err) {
        if (!serverStatic.fallback) {
          throw new Error('No fallback')
        }
  
        fullpath = await this._tryFile(serverStatic.fallback, serverStatic.index)
      }

      // Don't use fs promises, they are issues with them on pkg: https://github.com/zeit/pkg/issues/455
      const content = fs.readFileSync(fullpath)
      const extension = path.parse(fullpath).ext
      res.writeHead(200, { 'Content-type': this.mimeTypes[extension] || 'text/plain' })
      res.end(content)
    } catch (err) {
      logger.warn('GCE HTTP', req.headers.host, req.url, err)

      res.writeHead(404)
      res.write('404 Not Found')
      res.end()
    }
  }

  async proxyUpgrade (req, socket, head) {
    const server = this._getMatchServer(req.headers.host, req.url)

    if (!server) {
      return false
    }

    if (server.internal) {
      logger.debug('Proxy WS', `${server.slug}:internal`, req.url)
      this.gceWs.handleUpgrade(req, socket, head, ws => {
        this.gceWs.emit('connection', ws, req)
      })
      return true
    }

    if (server.static) {
      return false
    }

    const port = server.ports[server.roundRobinPortIndex]
    logger.debug('Proxy WS', `${server.slug}:${port}`, req.url)

    this.proxy.ws(req, socket, head, {
      target: {
        host: '127.0.0.1',
        port
      },
      ssl: this.lb.serverOptions
    })

    return true
  }

  _setupWssPingPong () {
    const pingPong = setInterval(() => {
      for (const ws of this.gceWs.clients) {
        if (ws.isAlive === false) {
          ws.terminate()
          continue
        }

        ws.isAlive = false
        ws.ping(function () {})
      }
    }, 30000)

    this.gceWs.on('close', () => {
      clearInterval(pingPong)
    })
  }

  async sendToGceWsConnections (type, data, wsInstance = null) {
    const payload = JSON.stringify({ type, data })

    for (const ws of this.gceWs.clients) {
      if (wsInstance && wsInstance !== ws) {
        continue
      }

      ws.send(payload)
    }
  }
}

module.exports = GCEProxy
