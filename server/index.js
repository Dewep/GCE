const GCEHttp = require('./http')
const GCELB = require('./lb')

class GCEServer {
  constructor () {
    this.config = null

    this.http = null
    this.lb = null
  }

  static async run (config) {
    const instance = new this()

    await instance.loadConfig(config)
    await instance.createHttp()
    await instance.createLB()

    await instance.run()

    return instance
  }

  async loadConfig (config) {
    this.config = config
  }

  async createHttp () {
    this.http = await GCEHttp.create(this)
  }

  async createLB () {
    this.lb = await GCELB.create(this)
  }

  async run () {
    this.http.listen()
    this.lb.listen()
  }
}

module.exports = GCEServer
