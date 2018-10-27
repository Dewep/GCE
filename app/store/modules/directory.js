const state = {
  list: [
    {
      slug: 'd1',
      name: 'Vagrant',
      path: 'C:\\Users\\Dewep\\WorkSpace',
      git: false,
      groups: ['g1'],
      commands: ['c6', 'c7']
    },
    {
      slug: 'd2',
      name: 'App',
      path: 'C:\\Users\\Dewep\\WorkSpace\\pandalab\\app',
      git: true,
      groups: ['g1', 'g2', 'g3'],
      commands: ['c8']
    },
    {
      slug: 'd3',
      name: 'Team server',
      path: 'C:\\Users\\Dewep\\WorkSpace\\pandalab\\app\\src\\server',
      git: true,
      groups: ['g1', 'g2', 'g3'],
      commands: ['c9']
    },
    {
      slug: 'd4',
      name: 'CDN',
      path: 'C:\\Users\\Dewep\\WorkSpace\\pandalab\\cdn',
      git: true,
      groups: ['g1', 'g2', 'g3'],
      commands: ['c10']
    },
    {
      slug: 'd5',
      name: 'Balancer',
      path: 'C:\\Users\\Dewep\\WorkSpace\\pandalab\\balancer',
      git: true,
      groups: ['g1', 'g2', 'g3'],
      commands: ['c11']
    },
    {
      slug: 'd6',
      name: 'Asset-Maker',
      path: 'C:\\Users\\Dewep\\WorkSpace\\pandalab\\asset-maker',
      git: true,
      groups: ['g1', 'g2', 'g3'],
      commands: ['c12']
    },
    {
      slug: 'd7',
      name: 'Console',
      path: 'C:\\Users\\Dewep\\WorkSpace\\pandalab\\console',
      git: true,
      groups: ['g1', 'g2', 'g3'],
      commands: ['c13', 'c14']
    }
  ]
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
