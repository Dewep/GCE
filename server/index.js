const utils = require('./utils')
const logger = require('../shared/logger')
const GCEServer = require('./server')
const path = require('path')

module.exports = async function ({ httpPort = 6730, httpsPort = 6731, configDirectories = [] }) {
  try {
    if (!configDirectories.length) {
      throw new Error('No configuration directories set')
    }

    const configs = []
    for (const configDirectory of configDirectories) {
      configs.push(require(path.join(process.cwd(), configDirectory)))
    }

    const config = utils.mergeDeep(
      {
        gce: {
          notifications: true
        }
      },
      ...configs,
      {
        gce: {
          host: 'gce.dewep.ovh',
          ports: {
            http: httpPort,
            https: httpsPort
          }
        }
      }
    )

    await GCEServer.run(config)
  } catch (err) {
    logger.error('GCE Server', 'Config', err.message)
  }
}
