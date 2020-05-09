const electron = require('electron')
const path = require('path')
const { fork } = require('child_process')

module.exports = function (settings) {
  if (!settings.window) {
    return
  }

  electron.ipcMain.on('run-server', (event, arg) => {
    const server = fork(path.join(__dirname, '..', '..', 'test.js'), [], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    })

    server.stdout.on('data', (d) => {
      event.reply('run-server-stdout', d.toString())
    })

    server.stderr.on('data', (d) => {
      event.reply('run-server-stderr', d.toString())
    })

    server.on('message', (m) => {
      event.reply('run-server-stdout', m)
    })

    server.on('error', (err) => {
      event.reply('run-server-stderr', err.message)
    })

    server.on('close', (code) => {
      event.reply('run-server-close', code)
    })
  })
}
