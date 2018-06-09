const electron = require('electron')
const path = require('path')
const url = require('url')
const windowStateKeeper = require('electron-window-state')

// Module to control application life.
const app = electron.app

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  if (mainWindow) {
    mainWindow.show()
    return
  }

  // Load the previous state with fallback to defaults
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 800
  })

  // Create the window using the state information
  mainWindow = new BrowserWindow({
    show: false,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'GCE'
  })

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(mainWindow)

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  if (process.argv0.endsWith('GCE\\node_modules\\electron\\dist\\electron.exe')) {
    mainWindow.webContents.openDevTools()
  }

  let minimizeOnClose = false

  const appIcon = new electron.Tray(path.join(__dirname, 'assets', 'icon.png'))
  appIcon.setContextMenu(electron.Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: function () {
        mainWindow.show()
      }
    },
    {
      label: 'Minimize App',
      click: function () {
        mainWindow.hide()
      }
    },
    {
      label: 'Quit',
      click: function () {
        app.isQuiting = true
        app.quit()
      }
    }
  ]))
  appIcon.on('click', () => {
    if (minimizeOnClose && mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.show()
      mainWindow.focus()
    }
  })

  mainWindow.once('ready-to-show', mainWindow.show)

  electron.ipcMain.on('register-focus-event', event => {
    mainWindow.on('focus', function () {
      event.sender.send('update-focus', '1')
    })
    mainWindow.on('blur', function () {
      event.sender.send('update-focus', '0')
    })
  })

  electron.ipcMain.on('focus-window', () => {
    setImmediate(function () {
      mainWindow.focus()
      mainWindow.webContents.focus()
      mainWindow.focusOnWebView()
    })
  })

  electron.ipcMain.on('minimize-on-close', (event, arg) => {
    minimizeOnClose = arg === '1'
  })

  mainWindow.on('minimize', function (event) {
    if (minimizeOnClose) {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  // Emitted when the window is going to be closed.
  mainWindow.on('close', function (event) {
    if (minimizeOnClose && !app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
      return false
    }

    mainWindow.hide()
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.show()
    mainWindow.focus()
  }
})

if (isSecondInstance) {
  app.quit()
} else {
  // Notification
  app.setAppUserModelId('net.dewep.gce')

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
}
