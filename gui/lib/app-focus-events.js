const electron = require('electron')

module.exports = function (settings) {
  if (!settings.window) {
    return
  }

  settings.window.once('ready-to-show', settings.window.show)

  electron.ipcMain.on('register-focus-event', event => {
    settings.window.on('focus', function () {
      event.reply('update-focus', '1')
    })
    settings.window.on('blur', function () {
      event.reply('update-focus', '0')
    })
  })

  electron.ipcMain.on('focus-window', () => {
    setImmediate(function () {
      settings.window.focus()
      settings.window.webContents.focus()
      settings.window.focusOnWebView()
    })
  })
}
