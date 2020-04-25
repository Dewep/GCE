const net = require('net')
const config = require('./config')

const server = net.createServer(function (client) {
  client.once('data', function (buf) {
    const proxy = net.createConnection(config.gce.ports.loadBalancer, function () {
      proxy.write(buf)
      client.pipe(proxy).pipe(client)
    })
    proxy.on('error', console.warn)
  })
  client.on('error', console.warn)
})
server.listen(+(process.argv[2] || '443'))
server.on('error', console.warn)
