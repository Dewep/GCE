const GCEConfigure = require('./configure')
const GCELBHttps = require('./lb-https')
const GCELBHttp = require('./lb-http')
const GCECommandStream = require('./command-stream')

class GCEServer {
  constructor () {
    this.config = null

    this.lbHttps = null
    this.lbHttp = null
    this.commandStreams = []
  }

  static async run (config) {
    const instance = new this()

    await instance.loadConfig(config)
    await instance.createLBs()

    await instance.run()

    return instance
  }

  async loadConfig (config) {
    this.config = new GCEConfigure(config)

    await this.config.reconfigure()
  }

  async createLBs () {
    this.lbHttps = await GCELBHttps.create(this)
    this.lbHttp = await GCELBHttp.create(this)
  }

  async run () {
    this.lbHttps.listen()
    this.lbHttp.listen()
  }

  async onNewConnection (ws) {
    await this.lbHttps.proxy.sendToGceWsConnections('config', this.config.getForClient(), ws)

    for (const commandStream of this.commandStreams) {
      await commandStream.sendUpdate(ws)
      await commandStream.sendOutput(null, ws)
    }
  }

  async onConnectionMessage (type, data, ws) {
    if (type === 'reconfigure') {
      await this.config.reconfigure()
      await this.lbHttps.proxy.sendToGceWsConnections('config', this.config.getForClient())
    } else if (type === 'newCommandStream') {
      await this.newCommandStream(data, ws)
    } else if (type === 'updateCommandStream') {
      await this.updateCommandStream(data, ws)
    } else if (type === 'newCommandDetached') {
      await this.newCommandDetached(data, ws)
    } else {
      throw new Error('Unknown WS action type: ' + type)
    }
  }

  async newCommandStream (data) {
    const commandStream = await GCECommandStream.create(this, data)
    this.commandStreams.push(commandStream)
  }

  async newCommandDetached (data) {
    await GCECommandStream.create(this, data, true)
  }

  async updateCommandStream (data) {
    const { streamSlug } = data
    const commandStream = this.commandStreams.find(cmd => cmd.slug === streamSlug)

    if (!commandStream) {
      throw new Error('Command stream not found')
    }

    await commandStream.update(data)
  }

  async removeCommandStream (streamSlug) {
    this.commandStreams = this.commandStreams.filter(cmd => cmd.slug !== streamSlug)
  }
}

module.exports = GCEServer
