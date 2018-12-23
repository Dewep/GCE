const storage = require('../storage')
const storageExampleData = require('../storage-example-data')

const state = {
  version: '2.0.0'
}

const getters = {
  GCEVersion: state => state.version
}

const actions = {
  async groupsImport (store, { groups }) {
    for (const group of groups) {
      let groupSlug = group.slug
      let currentCommandLines = []
      const currentGroup = store.getters.getGroup(groupSlug)

      if (currentGroup) {
        currentCommandLines = currentGroup.commands
          .map(commandSlug => store.getters.getCommand(commandSlug))
          .filter(command => command && command.args)
          .map(command => command.args.join(' '))

        await store.dispatch('groupUpdate', {
          groupSlug,
          name: group.name,
          global: !!group.global
        })
      } else {
        groupSlug = await store.dispatch('groupCreate', {
          groupSlug,
          name: group.name,
          global: !!group.global,
          commands: []
        })
      }

      for (const command of group.commands) {
        if (!currentCommandLines.includes(command.args.join(' '))) {
          await store.dispatch('commandCreate', {
            groupSlug,
            name: command.name,
            args: command.args,
            detached: !!command.detached
          })
        }
      }
    }
  },

  async resetData () {
    storage.array('projects', [])
    storage.array('groups', [])
    storage.array('directories', [])
    storage.array('commands', [])
    storage.object('identifiers', {})
    window.location.reload()
  },

  async resetExampleData () {
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
