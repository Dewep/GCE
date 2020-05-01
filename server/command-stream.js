const childProcess = require('child_process')
const treeKill = require('tree-kill')
const logger = require('./logger')

class GCECommandStream {
  constructor (gce) {
    this.gce = gce

    this.creationDate = Date.now()
    this.slug = Math.random().toString(36).substr(2) + this.creationDate.toString(36)

    this.projectSlug = null
    this.directorySlug = null
    this.primary = false
    this.name = null
    this.args = null
    this.cwd = null

    this.runningDate = null
    this.runningArgs = null
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

  async create ({ projectSlug, directorySlug, primary, args, name, options }, ws) {
    let cwd = process.cwd()
    if (options.cwd) {
      cwd = options.cwd
    } else if (projectSlug && this.gce.config.projects[projectSlug]) {
      if (directorySlug && this.gce.config.projects[projectSlug].directories[directorySlug]) {
        cwd = this.gce.config.projects[projectSlug].directories[directorySlug].path
      } else {
        cwd = this.gce.config.projects[projectSlug].path
      }
    }

    this.projectSlug = projectSlug
    this.directorySlug = directorySlug
    this.primary = primary || false
    this.args = args
    this.name = name
    this.cwd = cwd
    this.runningDate = Date.now()

    await this.sendUpdate()

    if (options && options.redirect) {
      await this.sendToWsConnections('streamRedirect', { streamSlug: this.slug }, ws)
    }

    this.start({ withUpdate: false })
  }

  async update ({ action, options = {} }) {
    if (action === 'start') {
      await this.start(options)
    } else if (action === 'stop') {
      await this.stop(options)
    } else if (action === 'restart') {
      await this.restart(options)
    } else if (action === 'close') {
      await this.close(options)
    }
  }

  async start ({ withUpdate = true, args = this.args } = {}) {
    if (!args.length) {
      throw new Error('Bad command args')
    }
    if (this.proc) {
      throw new Error('Command already running')
    }

    this.addOutput('info', 'Command: ' + args.join(' '))
    this.addOutput('info', this.cwd)

    this.proc = childProcess.spawn(args[0], args.slice(1), {
      cwd: this.cwd,
      shell: true,
      env: process.env
    })

    this.runningDate = Date.now()
    this.runningArgs = args
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
      if (code) {
        this.addOutput('info', `Process exited with code ${code}`)
      } else {
        this.addOutput('info', 'Process killed')
      }
      this.stoppedDate = Date.now()
      this.exitCode = code
      this.proc = null
      this.runningArgs = null

      this.sendUpdate()
    })

    if (withUpdate) {
      await this.sendUpdate()
    }
  }

  async stop () {
    if (!this.proc) {
      return
    }

    return new Promise((resolve, reject) => {
      this.addOutput('info', 'Killing the process...')
      treeKill(this.proc.pid, err => {
        if (err) {
          this.addOutput('info', 'Error during killing the process:')
          this.addOutput('info', err.message)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  async restart () {
    const args = this.runningArgs || this.args
    await this.stop()
    await new Promise(resolve => setTimeout(resolve, 250))
    this.addOutput('info', 'Restarting process...')
    await this.start({ args })
  }

  async close () {
    if (this.proc) {
      throw new Error('Process not stopped')
    }

    // TODO
  }

  async addOutput (type, content) {
    logger.debug('GCE Output', this.slug, type, content)

    const output = {
      date: Date.now(),
      type,
      content
    }

    this.output.push(output)

    await this.sendOutput(output)

    while (this.output.length > 100) {
      this.output.shift()
    }
  }

  async sendUpdate (wsInstance = null) {
    await this.sendToWsConnections('streamUpdate', {
      slug: this.slug,
      projectSlug: this.projectSlug,
      directorySlug: this.directorySlug,
      primary: this.primary,
      name: this.name,
      args: this.args,
      cwd: this.cwd,
      creationDate: this.creationDate,
      runningDate: this.runningDate,
      runningArgs: this.runningArgs,
      stoppedDate: this.stoppedDate,
      exitCode: this.exitCode
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
