const state = {
  list: [
    {
      slug: 'g1',
      name: 'Windows',
      commands: ['c1', 'c2']
    },
    {
      slug: 'g2',
      name: 'GIT',
      commands: ['c3', 'c4']
    },
    {
      slug: 'g3',
      name: 'npm',
      commands: ['c5']
    }
  ]
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
