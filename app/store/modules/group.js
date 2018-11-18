const storage = require('../storage')
const identifer = require('../identifier')

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
  async groupUpdate (store, { groupSlug, name, commands }) {
    const group = store.getters.getGroup(groupSlug)

    if (!group) {
      throw new Error('Group not found')
    }

    name = name || group.name
    commands = commands || group.commands || []

    store.commit('GROUP_UDPATE', { groupSlug, name, commands })
  },

  async groupCreate (store, { name, commands }) {
    const groupSlug = identifer('p')

    store.commit('GROUP_CREATE', { groupSlug, name, commands: commands || [] })

    return groupSlug
  },

  async groupRemove (store, { groupSlug }) {
    const group = store.getters.getGroup(groupSlug)

    if (!group) {
      throw new Error('Group not found')
    }

    store.commit('GROUP_REMOVE', { groupSlug })
  }
}

const mutations = {
  GROUP_CREATE (state, { groupSlug, name, commands }) {
    state.list = [
      ...state.list,
      {
        slug: groupSlug,
        name,
        commands
      }
    ]

    storage.array('groups', state.list)
  },

  GROUP_UDPATE (state, { groupSlug, name, commands }) {
    state.list = state.list.map(group => {
      if (group.slug !== groupSlug) {
        return group
      }

      return {
        slug: group.slug,
        name,
        commands
      }
    })

    storage.array('groups', state.list)
  },

  GROUP_REMOVE (state, { groupSlug }) {
    state.list = state.list.filter(group => group.slug !== groupSlug)

    storage.array('groups', state.list)
  }
}

module.exports = { state, getters, actions, mutations }
