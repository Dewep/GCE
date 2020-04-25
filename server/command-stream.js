const childProcess = require('child_process')
const logger = require('./logger')

class GCECommandStream {
  constructor (gce) {
    this.gce = gce

    this.creationDate = Date.now()
    this.slug = Math.random().toString(36).substr(2) + this.creationDate.toString(36)

    this.projectSlug = null
    this.directorySlug = null
    this.name = null
    this.args = null
    this.cwd = null

    this.runningDate = null
    this.stoppedDate = null
    this.exitCode = null
    this.output = []

    this.proc = null
  }

  static async create (gce, data) {
    const instance = new this(gce)

    await instance.create(data)

    return instance
  }

  async create ({ projectSlug, directorySlug, args, name, options }, ws) {
    this.projectSlug = projectSlug
    this.directorySlug = directorySlug
    this.args = args
    this.name = name
    this.cwd = process.cwd()
    this.runningDate = Date.now()

    await this.sendUpdate()

    if (options && options.redirect) {
      await this.sendToWsConnections('streamRedirect', { streamSlug: this.slug }, ws)
    }

    this.start(false)
  }

  async update () {}

  async start (withUpdate = true) {
    this.proc = childProcess.spawn(this.args[0], this.args.slice(1), {
      cwd: this.cwd,
      shell: true,
      env: process.env
    })

    this.runningDate = Date.now()
    this.stoppedDate = null
    this.exitCode = null

    this.proc.stdout.on('data', data => {
      this.addOutput('stdout', data.toString())
    })
    this.proc.stderr.on('data', data => {
      this.addOutput('stderr', data.toString())
    })
    this.proc.on('error', err => {
      this.addOutput('stderr', err.message)
    })

    this.proc.on('close', code => {
      this.addOutput('info', `Process exited with code ${code}`)
      this.exitCode = code

      this.sendUpdate()
    })

    if (withUpdate) {
      await this.sendUpdate()
    }
  }

  async addOutput (type, content) {
    logger.debug('GCE Output', this.slug, type, content)

    const output = {
      date: Date.now(),
      type,
      content
    }

    this.output.push(output)
    // TODO: Remove old outputs

    await this.sendOutput(output)
  }

  async sendUpdate (wsInstance = null) {
    await this.sendToWsConnections('streamUpdate', {
      slug: this.slug,
      projectSlug: this.projectSlug,
      directorySlug: this.directorySlug,
      name: this.name,
      args: this.args,
      cwd: this.cwd,
      creationDate: this.creationDate,
      runningDate: this.runningDate,
      stoppedDate: this.stoppedDate
    }, wsInstance)
  }

  async sendOutput (output = null, wsInstance = null) {
    await this.sendToWsConnections('streamOutput', {
      slug: this.slug,
      output: output ? [output] : this.output
    })
  }

  async sendToWsConnections (type, data, wsInstance = null) {
    await this.gce.http.sendToWsConnections(type, data, wsInstance)
  }
}

module.exports = GCECommandStream
