const createWindow = require('./create-window')

module.exports = function (settings) {
  const isFirstInstance = settings.app.requestSingleInstanceLock()

  if (!isFirstInstance) {
    settings.app.quit()
    return
  }

  if (settings.appUserModelId) {
    // Notification
    settings.app.setAppUserModelId(settings.appUserModelId)
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  settings.app.on('ready', () => createWindow(settings))

  // Quit when all windows are closed.
  settings.app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      settings.app.quit()
    }
  })

  // Someone tried to run a second instance, we should focus our window.
  settings.app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (settings.window) {
      if (settings.window.isMinimized()) {
        settings.window.restore()
      }
      settings.window.show()
      settings.window.focus()
    }
  })

  settings.app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (settings.window === null) {
      createWindow(settings)
    }
  })
}
