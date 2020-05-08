const sudo = require('sudo-prompt')
const path = require('path')

module.exports = function (env, onExit, onStdout, onStderr) {
  const options = {
    name: 'GCE proxy'
  }

  if (env) {
    options.env = env
  }

  const cmd = `node "${path.join(process.resourcesPath, 'proxy-to-gce.js')}"`

  sudo.exec(cmd, options, function (error, stdout, stderr) {
    if (stdout) {
      onStdout(stdout)
    }
    if (stderr) {
      onStderr(stderr)
    }
    if (error) {
      onStderr(error.message)
    }
    onExit(error ? 1 : 0)
  })
}
