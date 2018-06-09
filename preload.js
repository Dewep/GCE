const { ipcRenderer } = require('electron')
const pkg = require('./package.json')

process.once('loaded', () => {
  global.GCEVersion = pkg.version

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
})
