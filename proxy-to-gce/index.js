const net = require('net')
const http = require('http')

module.exports = function ({ gceSecurePort = 6731, managerPort = 6732, proxyPort = 443, managerStopPath = 'stop-proxy-to-gce' }) {
  const proxy = net.createServer(function (client) {
    client.once('data', function (buf) {
      const proxy = net.createConnection(gceSecurePort, function () {
        proxy.write(buf)
        client.pipe(proxy).pipe(client)
      })
      proxy.on('error', () => {})
    })
    client.on('error', () => {})
  })

  const manager = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('github.com/Dewep/GCE:proxy-to-gce', function () {
      if (req.url === '/' + managerStopPath) {
        shutdown()
      }
    })
  })

  function shutdown () {
    proxy.close(function () {
      manager.close(function () {
        process.exit(0)
      })
    })
  }

  proxy.on('error', shutdown)
  manager.on('error', shutdown)

  proxy.listen(proxyPort)
  manager.listen(managerPort)
}
