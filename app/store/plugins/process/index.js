// const path = require('path')
const childProcess = window.nodeRequire('child_process')
// const treeKill = require('tree-kill')
const fixPath = window.nodeRequire('fix-path')

fixPath() // Fix for MacOS users, include /usr/local/bin in $PATH

module.exports = function (store) {
  const triggerTypes = ['PROCESS_START', 'PROCESS_STOP', 'PROCESS_RESTART']

  // stop (cmd) {
  //   if (cmd.stop) {
  //     return true
  //   }
  //   if (cmd['stop-cmd'] && this.status[cmd.slug] === 2 && !cmd.proc) {
  //     cmd.stop = true
  //     this.runCommand(cmd, cmd['stop-cmd'], 0)
  //     return true
  //   }
  //   if (this.status[cmd.slug] === 1 && cmd.proc) {
  //     this.addContent(cmd, 'info', 'Killing the process...')
  //     cmd.stop = true
  //     treeKill(cmd.proc.pid, err => {
  //       if (err) {
  //         this.addContent(cmd, 'info', 'Error during killing the process')
  //         this.addContent(cmd, 'info', err.message)
  //       }
  //     })
  //     return true
  //   }
  //   return false
  // }

  function spawnDetachedCommand (cwd, args) {
    const argv = args.map(arg => arg.replace('%dir%', cwd))
    const subprocess = childProcess.spawn(argv[0], argv.slice(1), {
      cwd,
      // env: cmd.env || this.env,
      detached: true,
      stdio: 'ignore'
    })
    subprocess.unref()
  }

  function runCommand (directory, command, hasStop = false) {
    const cwd = directory.path
    const argv = (hasStop ? command.stopArgs : command.args).map(arg => arg.replace('%dir%', cwd))
    const directorySlug = directory.slug
    const commandSlug = command.slug

    store.dispatch('processUpdate', { directorySlug, commandSlug, status: command.stopArgs ? 'stating' : 'running' })

    store.dispatch('processOutputAddContent', { directorySlug, commandSlug, type: 'info', content: cwd + '\n' + argv.join(' ') })

    const proc = childProcess.spawn(argv[0], argv.slice(1), {
      cwd,
      shell: true
      // env: cmd.env || this.env
    })

    proc.stdout.on('data', data => {
      store.dispatch('processOutputAddContent', { directorySlug, commandSlug, type: 'stdout', content: data.toString() })
    })
    proc.stderr.on('data', data => {
      store.dispatch('processOutputAddContent', { directorySlug, commandSlug, type: 'stderr', content: data.toString() })
    })
    proc.on('error', err => {
      store.dispatch('processOutputAddContent', { directorySlug, commandSlug, type: 'stderr', content: err.message })
    })
    proc.on('close', code => {
      store.dispatch('processOutputAddContent', { directorySlug, commandSlug, type: 'info', content: `Process exited with code ${code}` })

      const status = code ? 'error' : (command.stopArgs && !hasStop ? 'started' : 'stopped')
      store.dispatch('processUpdate', { directorySlug, commandSlug, status })
      // if (cmd.restart) {
      //   cmd.restart = false
      //   setTimeout(() => this.start(cmd))
      // }
    })
  }

  store.subscribe(function ({ type, payload }, state) {
    if (triggerTypes.includes(type)) {
      const command = store.getters.getCommand(payload.commandSlug)
      const directory = store.getters.getDirectory(payload.directorySlug)

      if (!command || !directory) {
        console.warn('[process] Command or directory not found', payload)
        return
      }

      const process = store.getters.getProcess(payload.directorySlug, payload.commandSlug)
      // const processOutput = store.getters.getProcessOutput(payload.directorySlug, payload.commandSlug)

      // Available status: starting, started, running, error, stopped
      const status = (process && process.status) || 'stopped'

      // console.log(type, { command, process, processOutput })

      if (type === 'PROCESS_START' && (status === 'stopped' || status === 'error')) {
        if (command.detached) {
          return spawnDetachedCommand(directory.path, command.args)
        }

        return runCommand(directory, command, false)
      }
    }
  })
}
