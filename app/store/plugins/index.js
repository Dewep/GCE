const removeLostItems = require('./remove-lost-items')
const refreshAutoDefinition = require('./refresh-auto-definition')
const process = require('./process')

module.exports = [
  removeLostItems,
  refreshAutoDefinition,
  process
]
