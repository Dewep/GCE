const electron = require('electron')
const path = require('path')
const windowBoundsKeeper = require('./window-bounds-keeper')
const appMenu = require('./app-menu')
const appTrayIcon = require('./app-tray-icon')
const appFocusEvents = require('./app-focus-events')
const appSelectDirectory = require('./app-select-directory')
const appRunServer = require('./app-run-server')

module.exports = function (settings) {
  if (settings.window) {
    settings.window.show()
    return
  }

  const browserWindowOptions = {
    ...settings.browserWindowOptions,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      enableRemoteModule: false
      // contextIsolation: true,
      // sandbox: true
    }
  }

  windowBoundsKeeper(settings, browserWindowOptions)

  settings.window = new electron.BrowserWindow(browserWindowOptions)

  settings.window.loadURL(settings.url)

  // Open the DevTools.
  // if (process.argv0.endsWith('GCE\\node_modules\\electron\\dist\\electron.exe')) {
  settings.window.webContents.openDevTools()
  // }

  appMenu(settings)

  appTrayIcon(settings)

  appFocusEvents(settings)

  appSelectDirectory(settings)

  appRunServer(settings)

  settings.window.on('closed', function () {
    settings.window = null
    settings.appTray = null
  })
}
