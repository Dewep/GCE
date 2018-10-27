const general = require('./general')

const project = require('./project')
const group = require('./group')
const directory = require('./directory')
const command = require('./command')

const git = require('./git')
const process = require('./process')

module.exports = {
  general,

  project,
  group,
  directory,
  command,

  git,
  process
}
