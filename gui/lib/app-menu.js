const electron = require('electron')

module.exports = function (settings) {
  if (!settings.window) {
    return
  }

  const isMac = process.platform === 'darwin'

  const learnMore = async () => {
    await electron.shell.openExternal('https://github.com/Dewep/GCE')
  }

  const menuTemplate = isMac ? [
    {
      label: 'GCE',
      submenu: [
        { role: 'about' },
        { role: 'quit' }
      ]
    }, {
      label: 'Edit',
      submenu: [
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' }
      ]
    }, {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click: learnMore
        }
      ]
    }
  ] : []

  const menu = electron.Menu.buildFromTemplate(menuTemplate)
  electron.Menu.setApplicationMenu(menu)
}
