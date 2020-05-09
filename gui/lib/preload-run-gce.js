const { ipcRenderer } = require('electron')
const sudo = require('sudo-prompt')
const path = require('path')

function gceAdmin (args, onExit, onStdout, onStderr) {
  const gceCliPath = path.join(process.resourcesPath, 'gce-cli') + (process.platform === 'win32' ? '.exe' : '')
  const cmd = `"${gceCliPath}" ${args.map(arg => `"${arg}"`).join(' ')}`

  const options = {
    name: 'GCE proxy'
  }

  sudo.exec(cmd, options, function (error, stdout, stderr) {
    if (stdout) {
      onStdout(stdout)
    }
    if (stderr) {
      onStderr(stderr)
    }
    if (error) {
      onStderr(error.message)
    }
    onExit(error ? 1 : 0)
  })
}

function gce (args, onExit, onStdout, onStderr) {
  ipcRenderer.send('run-server', JSON.stringify(args))

  ipcRenderer.on('run-server-stdout', (event, arg) => {
    console.log('run-server-stdout', arg)
  })
  ipcRenderer.on('run-server-stderr', (event, arg) => {
    console.log('run-server-stderr', arg)
  })
  ipcRenderer.on('run-server-close', (event, arg) => {
    console.log('run-server-close', arg)
  })
}

module.exports = function (asAdmin, args, onExit, onStdout, onStderr) {
  if (asAdmin) {
    return gceAdmin(args, onExit, onStdout, onStderr)
  }

  return gce(args, onExit, onStdout, onStderr)
}
