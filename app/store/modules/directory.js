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
  async directoryUpdate (store, { directorySlug, projectSlug, name, path, git, groups, commands }) {
    const directory = store.getters.getDirectory(directorySlug)
    const project = store.getters.getProjectByDirectory(directorySlug)

    if (!directory) {
      throw new Error('Directory not found')
    }

    projectSlug = projectSlug || project.slug
    name = name || directory.name
    path = path || directory.path
    git = git !== undefined ? git : directory.git
    groups = groups || directory.groups
    commands = commands || directory.commands

    store.commit('DIRECTORY_UDPATE', { directorySlug, name, path, git, groups, commands })

    if (projectSlug !== project.slug) {
      await store.dispatch('projectDirectoryMove', { projectSlug, directorySlug })
    }
  }
}

const mutations = {
  DIRECTORY_UDPATE (state, { directorySlug, name, path, git, groups, commands }) {
    state.list = state.list.map(directory => {
      if (directory.slug !== directorySlug) {
        return directory
      }

      return {
        slug: directory.slug,
        name,
        path,
        git,
        groups,
        commands
      }
    })

    storage.array('directories', state.list)
  }
}

module.exports = { state, getters, actions, mutations }
