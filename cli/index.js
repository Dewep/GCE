const { program } = require('commander')
const pkg = require('../package.json')
const proxyToGce = require('../proxy-to-gce')
const server = require('../server')

program
  .version(pkg.version)
  .name('gce')

program
  .command('server <configDirectories...>')
  .description('Run GCE server')
  .option('-s, --ssl <gceHost>', 'enable SSL, and set GCE host/domain', null)
  .option('-g, --gce-server-port <port>', 'GCE server port', /^[0-9]+$/, 6730)
  .option('-l, --gce-lb-port <port>', 'GCE Load-Balancer port', /^[0-9]+$/, 6731)
  .action(function (configDirectories, cmd) {
    server({
      serverPort: +cmd.gceServerPort,
      loadBalancerPort: +cmd.gceLbPort,
      ssl: cmd.ssl,
      configDirectories
    })
  })

program
  .command('proxy-to-gce')
  .description('Create a proxy to GCE on port 443')
  .option('-l, --gce-lb-port <port>', 'GCE Load-Balancer port', /^[0-9]+$/, 6731)
  .option('-m, --manager-port <port>', 'proxy manager port', /^[0-9]+$/, 6732)
  .option('-p, --proxy-port <port>', 'proxy port', /^[0-9]+$/, 443)
  .option('-s, --manager-stop-path <path>', 'manager path to stop proxy', 'stop-proxy-to-gce')
  .action(function (cmd) {
    proxyToGce({
      gceSecurePort: +cmd.gceLbPort,
      managerPort: +cmd.managerPort,
      proxyPort: +cmd.proxyPort,
      managerStopPath: cmd.managerStopPath
    })
  })

program.parse()