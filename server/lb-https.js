const logger = require('../shared/logger')
const https = require('https')
const tls = require('tls')
const GCELB = require('./lb')

class GCELBHttps extends GCELB {
  constructor (gce) {
    super(gce, 'GCE LB HTTPS', gce.config.gce.ports.https)

    this.certificates = {}
    this.serverOptions = null
    this.isSecure = true
  }

  async create () {
    await super.create()

    await this._loadCertificates()

    this.serverOptions = {
      SNICallback: this._SNICallback.bind(this)
    }

    this.server = https.createServer(this.serverOptions, this._onRequest.bind(this))
    this.server.on('upgrade', this._onUpgrade.bind(this))
  }

  async _loadCertificates () {
    for (const serverName of Object.keys(this.gce.config.loadBalancers)) {
      this.certificates[serverName] = await this._createSecureContext(this.gce.config.loadBalancers[serverName])
    }
  }

  async _createSecureContext (options) {
    const context = tls.createSecureContext({
      cert: options.crt,
      key: options.key
    })

    return context
  }

  _SNICallback (serverName, callback) {
    let context = null

    const host = '.' + serverName.split(':')[0]

    for (const serverNameCertificate of Object.keys(this.certificates)) {
      if (host.endsWith(serverNameCertificate)) {
        context = this.certificates[serverNameCertificate]
        break
      }
    }

    if (!context) {
      logger.error(this.loggerName, serverName, 'SSL certificate not found, host was', host)
    }

    if (callback) {
      callback(null, context)
    } else {
      return context
    }
  }
}

module.exports = GCELBHttps
