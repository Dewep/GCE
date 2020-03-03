
const isMac = process.platform === 'darwin'

const learnMore = async () => {
  const { shell } = require('electron')
  await shell.openExternal('https://github.com/Dewep/GCE')
}

const template = isMac ? [
  {
    label: 'GCE',
    submenu : [
      { role: 'about' },
      { role: 'quit' }
    ]
  }, {
    label: 'Edit',
    submenu: [
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
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

module.exports = template
