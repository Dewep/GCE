const logger = require('../shared/logger')
const https = require('https')
const tls = require('tls')
const GCEProxy = require('./proxy')

class GCELB {
  constructor (gce, loggerName, serverPort) {
    this.gce = gce

    this.loggerName = loggerName
    this.serverPort = serverPort
    this.server = null
    this.serverOptions = null
    this.isSecure = false
    this.proxy = null
  }

  static async create (gce) {
    const instance = new this(gce)

    await instance.create()

    return instance
  }

  async create () {
    this.proxy = await GCEProxy.create(this.gce, this)
  }

  async listen () {
    this.server.listen(this.serverPort, () => {
      logger.info(this.loggerName, 'Server', 'Started on port', this.serverPort)
    })
  }

  async _onRequest (req, res) {
    req.headers.host = req.headers.host.split(':')[0] // Remove port from host

    try {
      if (await this.proxy.proxyRequest(req, res)) {
        return
      }
    } catch (err) {
      logger.error(this.loggerName, req.headers.host, err.message)
    }

    logger.warn(this.loggerName, req.headers.host, 'No proxy found')

    res.writeHead(404)
    res.write('404 Not Found')
    res.end()
  }

  async _onUpgrade (req, socket, head) {
    req.headers.host = req.headers.host.split(':')[0] // Remove port from host

    try {
      if (await this.proxy.proxyUpgrade(req, socket, head)) {
        return
      }
    } catch (err) {
      logger.error(this.loggerName, req.headers.host, err.message)
    }

    logger.warn(this.loggerName, req.headers.host, 'No proxy found')

    socket.destroy()
  }
}

module.exports = GCELB
