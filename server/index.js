const utils = require('./utils')
const logger = require('./logger')
const GCEServer = require('./server')

module.exports = async function ({ serverPort = 6730, loadBalancerPort = 6731, ssl = null, configDirectories = [] }) {
  try {
    if (!configDirectories.length) {
      throw new Error('No configuration directories set')
    }

    const configs = []
    for (const configDirectory of configDirectories) {
      configs.push(require(configDirectory))
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
          host: ssl || null,
          ports: {
            server: serverPort,
            loadBalancer: loadBalancerPort
          },
          secure: !!ssl
        }
      }
    )

    await GCEServer.run(config)
  } catch (err) {
    logger.error('GCE Server', 'Config', err.message)
  }
}
