const storage = require('../storage')

const state = {
  list: storage.array('commands')
}

const getters = {
  commands: state => state.list || [],

  getCommand: (state, getters) => commandSlug => getters.commands.find(item => item.slug === commandSlug) || null,

  getSidebarCommand: (state, getters) => (directorySlug, commandSlug) => {
    const command = getters.getCommand(commandSlug)

    if (!command) {
      return null
    }

    const status = getters.getProcessStatus(directorySlug, commandSlug)

    const unread = getters.getProcessUnread(directorySlug, commandSlug)

    return {
      ...command,
      status,
      unread
    }
  }
}

const actions = {
}

const mutations = {
}

module.exports = { state, getters, actions, mutations }
