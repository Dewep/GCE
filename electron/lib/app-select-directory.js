const { dialog, ipcMain } = require('electron')

module.exports = function (settings) {
  if (!settings.window) {
    return
  }

  ipcMain.on('select-directory', async (event, arg) => {
    try {
      const result = await dialog.showOpenDialog(settings.window, {
        properties: ['openDirectory']
      })
      event.reply('select-directory', result.filePaths)
    } catch (err) {}
  })
}
