const configs = require('./config')
const utils = require('./utils')

const defaultConfiguration = {
  gce: {
    hosts: [],
    ports: {
      server: 6730,
      loadBalancer: 6731
    },
    secure: true
  }
}

module.exports = utils.mergeDeep(defaultConfiguration, ...configs)
