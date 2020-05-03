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
    this.env = null
    this.notifications = null

    this.runningDate = null
    this.runningArgs = null
    this.stoppedDate = null
    this.exitCode = null
    this.output = []

    this.proc = null
  }

  static async create (gce, data, detached = false) {
    const instance = new this(gce)

    await instance.create(data)

    if (detached) {
      await instance._startDetached()
    } else {
      await instance.sendUpdate()

      if (data.options && data.options.redirect) {
        await instance._sendToWsConnections('streamRedirect', { streamSlug: instance.slug })
      }

      await instance._start({ withUpdate: false })
    }

    return instance
  }

  async create ({ projectSlug, directorySlug, primary = false, args, env = null, name = null, notifications = false, options = {} }, ws) {
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
    this.name = name || args.join(' ')
    this.cwd = cwd
    this.env = env || {}
    this.notifications = notifications
    this.runningDate = Date.now()
  }

  async update ({ action, options = {} }) {
    if (action === 'start') {
      await this._start(options)
    } else if (action === 'stop') {
      await this._stop(options)
    } else if (action === 'restart') {
      await this._restart(options)
    } else if (action === 'close') {
      await this._close(options)
    }
  }

  async _start ({ withUpdate = true, args = this.args, notifications = this.notifications } = {}) {
    args = await this._convertArgs(args)
    if (this.proc) {
      throw new Error('Command already running')
    }

    this.addOutput('info', 'Command: ' + args.join(' '))
    this.addOutput('info', this.cwd)

    this.proc = childProcess.spawn(args[0], args.slice(1), {
      cwd: this.cwd,
      shell: true,
      env: { ...process.env, ...this.env }
    })

    this.notifications = notifications
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

  async _startDetached () {
    const args = await this._convertArgs(this.args)
    const subprocess = childProcess.spawn(args[0], args.slice(1), {
      cwd: this.cwd,
      env: { ...process.env, ...this.env },
      detached: true,
      stdio: 'ignore'
    })

    subprocess.on('error', err => {
      logger.warn('Command detached', this.slug, err.message)
    })

    subprocess.unref()
  }

  async _convertArgs (args) {
    if (!args.length) {
      throw new Error('Bad command args')
    }
    return args.map(arg => {
      return arg.replace(/%\{GCE:CWD\}/g, this.cwd)
    })
  }

  async _stop () {
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

  async _restart () {
    const args = this.runningArgs || this.args
    await this._stop()
    await new Promise(resolve => setTimeout(resolve, 250))
    this.addOutput('info', 'Restarting process...')
    await this._start({ args })
  }

  async _close () {
    if (this.proc) {
      throw new Error('Process not stopped')
    }

    await this.gce.removeCommandStream(this.slug)

    await this._sendToWsConnections('streamRemove', {
      slug: this.slug
    })
  }

  async addOutput (type, content) {
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
    await this._sendToWsConnections('streamUpdate', {
      slug: this.slug,
      projectSlug: this.projectSlug,
      directorySlug: this.directorySlug,
      primary: this.primary,
      name: this.name,
      args: this.args,
      env: this.env,
      cwd: this.cwd,
      notifications: this.notifications,
      creationDate: this.creationDate,
      runningDate: this.runningDate,
      runningArgs: this.runningArgs,
      stoppedDate: this.stoppedDate,
      exitCode: this.exitCode
    }, wsInstance)
  }

  async sendOutput (output = null, wsInstance = null) {
    await this._sendToWsConnections('streamOutput', {
      slug: this.slug,
      output: output ? [output] : this.output,
      initial: wsInstance !== null
    }, wsInstance)
  }

  async _sendToWsConnections (type, data, wsInstance = null) {
    await this.gce.http.sendToWsConnections(type, data, wsInstance)
  }
}

module.exports = GCECommandStream
