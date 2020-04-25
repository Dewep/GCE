const net = require('net')
const config = require('./config')

net.createServer(function (client) {
  client.once('data', function (buf) {
    const proxy = net.createConnection(config.gce.ports.loadBalancer, function () {
      proxy.write(buf)
      client.pipe(proxy).pipe(client)
    })
  })
}).listen(+(process.argv[2] || '443'))
