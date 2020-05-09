const { ipcRenderer } = require('electron')
const runGCE = require('./preload-run-gce')

process.once('loaded', () => {
  global.isFocus = false
  ipcRenderer.send('register-focus-event')
  ipcRenderer.on('update-focus', (event, arg) => {
    global.isFocus = arg === '1'
  })

  global.focusWindow = () => {
    ipcRenderer.send('focus-window')
  }

  global.minimizeOnClose = (value) => {
    ipcRenderer.send('minimize-on-close', value ? '1' : '0')
  }

  ipcRenderer.on('select-directory', (event, arg) => {
    if (window.onSelectDirectory) {
      window.onSelectDirectory(arg)
    }
  })

  global.selectDirectory = async function () {
    ipcRenderer.send('select-directory')
  }

  global.runGCE = runGCE

  global.runServer = function (env, onExit, onStdout, onStderr) {
    ipcRenderer.send('run-server')
  }
  ipcRenderer.on('run-server-stdout', (event, arg) => {
    console.log('run-server-stdout', arg)
  })
  ipcRenderer.on('run-server-stderr', (event, arg) => {
    console.log('run-server-stderr', arg)
  })
  ipcRenderer.on('run-server-close', (event, arg) => {
    console.log('run-server-close', arg)
  })
})
