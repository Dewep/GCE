const storage = require('../storage')
const identifer = require('../identifier')

const state = {
  list: storage.array('groups')
}

const getters = {
  groups: state => state.list || [],

  groupsGlobal: (state, getters) => getters.groups.filter(item => item.global),

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
  async groupUpdate (store, { groupSlug, name, global, commands }) {
    const group = store.getters.getGroup(groupSlug)

    if (!group) {
      throw new Error('Group not found')
    }

    name = name || group.name
    global = global || group.global || false
    commands = commands || group.commands || []

    store.commit('GROUP_UDPATE', { groupSlug, name, global, commands })
  },

  async groupCreate (store, { groupSlug, name, global, commands }) {
    groupSlug = groupSlug || identifer('p')

    global = global || false
    store.commit('GROUP_CREATE', { groupSlug, name, global, commands: commands || [] })

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
  GROUP_CREATE (state, { groupSlug, name, global, commands }) {
    state.list = [
      ...state.list,
      {
        slug: groupSlug,
        name,
        global,
        commands
      }
    ]

    storage.array('groups', state.list)
  },

  GROUP_UDPATE (state, { groupSlug, name, global, commands }) {
    state.list = state.list.map(group => {
      if (group.slug !== groupSlug) {
        return group
      }

      return {
        slug: group.slug,
        name,
        global,
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
