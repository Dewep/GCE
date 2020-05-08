const electron = require('electron')

module.exports = function (settings) {
  if (!settings.window || !settings.appTrayIcon) {
    return
  }

  settings.appTray = new electron.Tray(settings.appTrayIcon)

  settings.appTray.setContextMenu(electron.Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: function () {
        settings.window.show()
      }
    },
    {
      label: 'Minimize App',
      click: function () {
        settings.window.hide()
      }
    },
    {
      label: 'Quit',
      click: function () {
        settings.app.isQuiting = true
        settings.app.quit()
      }
    }
  ]))

  settings.appTray.on('click', () => {
    if (settings.minimizeOnClose && settings.window.isVisible()) {
      settings.window.hide()
      return
    }

    if (settings.window.isMinimized()) {
      settings.window.restore()
    }
    settings.window.show()
    settings.window.focus()
  })

  electron.ipcMain.on('minimize-on-close', (event, arg) => {
    settings.minimizeOnClose = arg === '1'
  })

  settings.window.on('minimize', function (event) {
    if (settings.minimizeOnClose) {
      event.preventDefault()
      settings.window.hide()
    }
  })

  // Emitted when the window is going to be closed.
  settings.window.on('close', function (event) {
    if (settings.minimizeOnClose && !settings.app.isQuiting) {
      event.preventDefault()
      settings.window.hide()
      return false
    }

    settings.window.hide()
  })
}
