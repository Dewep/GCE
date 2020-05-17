const net = require('net')
const http = require('http')
const logger = require('../shared/logger')

module.exports = function ({ gceSecurePort = 6731, managerPort = 6732, proxyPort = 443, managerStopPath = 'stop-proxy-to-gce' }) {
  const proxy = net.createServer(function (client) {
    client.once('data', function (buf) {
      const proxy = net.createConnection(gceSecurePort, function () {
        proxy.write(buf)
        client.pipe(proxy).pipe(client)
      })
      proxy.on('error', err => {
        logger.debug('Proxy', 'Error', err.message)
      })
    })
    client.on('error', err => {
      logger.debug('Client', 'Error', err.message)
    })
  })

  const manager = http.createServer(function (req, res) {
    logger.debug('Manager', 'Request', req.url)
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('github.com/Dewep/GCE:proxy-to-gce', function () {
      if (req.url === '/' + managerStopPath) {
        shutdown(null)
      }
    })
  })

  function shutdown (error) {
    if (error) {
      logger.error('Core', 'Error', error)
    }
    logger.info('Core', 'Shutdown', error ? 'After error' : 'After manager request')
    proxy.close(function () {
      manager.close(function () {
        process.exit(0)
      })
    })
  }

  proxy.on('error', err => shutdown(err))
  manager.on('error', err => shutdown(err))

  proxy.listen(proxyPort, () => {
    logger.info('Proxy', 'Server', 'Started on port', proxyPort)
  })
  manager.listen(managerPort, () => {
    logger.info('Manager', 'Server', 'Started on port', managerPort)
  })
}
