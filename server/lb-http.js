const http = require('http')
const GCELB = require('./lb')

class GCELBHttp extends GCELB {
  constructor (gce) {
    super(gce, 'GCE LB HTTP', gce.config.gce.ports.http)
  }

  async create () {
    await super.create()

    this.server = http.createServer(this._onRequest.bind(this))
    this.server.on('upgrade', this._onUpgrade.bind(this))
  }
}

module.exports = GCELBHttp
