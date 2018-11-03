const storage = require('../storage')
const storageExampleData = require('../storage-example-data')

const state = {
  version: '2.0.0'
}

const getters = {
  GCEVersion: state => state.version
}

const actions = {
  resetData () {
    storage.array('projects', [])
    storage.array('groups', [])
    storage.array('directories', [])
    storage.array('commands', [])
    storage.object('identifiers', {})
    window.location.reload()
  },
  resetExampleData () {
    storage.array('projects', storageExampleData.projects)
    storage.array('groups', storageExampleData.groups)
    storage.array('directories', storageExampleData.directories)
    storage.array('commands', storageExampleData.commands)
    storage.object('identifiers', storageExampleData.identifiers)
    window.location.reload()
  }
}

const mutations = {
}

module.exports = { state, getters, actions, mutations }
