const storage = require('../storage')

const state = {
  list: storage.array('directories')
}

const getters = {
  directories: state => state.list || [],

  getDirectory: (state, getters) => directorySlug => getters.directories.find(item => item.slug === directorySlug) || null,

  getSidebarDirectory: (state, getters) => directorySlug => {
    const directory = getters.getDirectory(directorySlug)

    if (!directory) {
      return null
    }

    let git = directory.git
    if (git) {
      git = getters.getGitStatus(directorySlug) || false
    }

    const groups = (directory.groups || [])
      .map(groupSlug => getters.getSidebarGroup(directorySlug, groupSlug))
      .filter(item => item)

    const commands = (directory.commands || [])
      .map(commandSlug => getters.getSidebarCommand(directorySlug, commandSlug))
      .filter(item => item)

    return {
      ...directory,
      git,
      groups,
      commands
    }
  }
}

const actions = {
}

const mutations = {
}

module.exports = { state, getters, actions, mutations }
