const GCEHttp = require('./http')
const GCELB = require('./lb')
const GCECommandStream = require('./command-stream')

class GCEServer {
  constructor () {
    this.config = null

    this.http = null
    this.lb = null
    this.commandStreams = []
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
    // Check path, existing directories, slug, bad config, ...
    // Set error message for directory/project
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

  async onNewConnection (ws) {
    await this.http.sendToWsConnections('config', this.config, ws)

    for (const commandStream of this.commandStreams) {
      await commandStream.sendUpdate(ws)
      await commandStream.sendOutput(null, ws)
    }
  }

  async onConnectionMessage (type, data, ws) {
    if (type === 'newCommandStream') {
      await this.newCommandStream(data, ws)
    } else if (type === 'updateCommandStream') {
      await this.updateCommandStream(data, ws)
    } else {
      throw new Error('Unknown WS action type: ' + type)
    }
  }

  async newCommandStream (data) {
    const commandStream = await GCECommandStream.create(this, data)
    this.commandStreams.push(commandStream)
  }

  async updateCommandStream (data) {
    const { streamSlug } = data
    const commandStream = this.commandStreams.find(cmd => cmd.slug === streamSlug)

    if (!commandStream) {
      throw new Error('Command stream not found')
    }

    await commandStream.update(data)
  }
}

module.exports = GCEServer
