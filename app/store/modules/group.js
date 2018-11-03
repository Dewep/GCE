const storage = require('../storage')

const state = {
  list: storage.array('groups')
}

const getters = {
  groups: state => state.list || [],

  getGroup: (state, getters) => groupSlug => getters.groups.find(item => item.slug === groupSlug) || null,

  getSidebarGroup: (state, getters) => (directorySlug, groupSlug) => {
    const group = getters.getGroup(groupSlug)

    if (!group) {
      return null
    }

    const commands = (group.commands || [])
      .map(commandSlug => getters.getSidebarCommand(directorySlug, commandSlug))
      .filter(item => item)

    return {
      ...group,
      commands
    }
  }
}

const actions = {
}

const mutations = {
}

module.exports = { state, getters, actions, mutations }
