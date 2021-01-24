const electron = require('electron')
const path = require('path')
const url = require('url')
const Store = require('electron-store')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

const instance = require('./lib/instance')

const settings = {
  app: electron.app,

  store: new Store(),

  window: null,

  appUserModelId: 'net.dewep.gce',

  browserWindowOptions: {
    show: false,
    icon: path.join(__dirname, 'public', 'favicon.png'),
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    title: 'GCE'
  },

  // url: 'file://' + path.join(__dirname, 'public', 'index.html'),
  url: 'https://gce-launcher.dewep.ovh',

  appTray: null,
  appTrayIcon: path.join(__dirname, 'public', 'favicon.png'),

  minimizeOnClose: true // can be override with 'minimize-on-close' ipc event
}

instance(settings)
