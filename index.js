const GCEServer = require('./server')
const logger = require('./server/logger')

async function main () {
  const config = require('./config')

  if (!config) {
    throw new Error('Config cannot be null/undefined')
  }

  return GCEServer.run(config)
}

main().catch(function (err) {
  logger.error('GCE Core', 'Main error', err)
  process.exit(1)
})
