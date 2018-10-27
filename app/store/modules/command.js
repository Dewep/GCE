const state = {
  list: [
    {
      slug: 'c1',
      name: 'Shell',
      args: ['C:\\Program Files\\Git\\git-bash.exe', '--cd=%dir%'],
      detached: true
    },
    {
      slug: 'c2',
      name: 'Explorer',
      args: ['explorer.exe', '%dir%'],
      detached: true
    },
    {
      slug: 'c3',
      name: 'Git pull FF',
      args: ['git', 'pull', '--ff-only'],
      detached: false
    },
    {
      slug: 'c4',
      name: 'Git GUI',
      args: ['git-gui.exe'],
      detached: true
    },
    {
      slug: 'c5',
      name: 'npm install',
      args: ['npm', 'install'],
      detached: false
    },
    {
      slug: 'c6',
      name: 'vagrant up',
      args: ['vagrant', 'up'],
      detached: false
    },
    {
      slug: 'c7',
      name: 'vagrant up 2',
      args: ['vagrant', 'up'],
      detached: false
    },
    {
      slug: 'c8',
      name: 'npm run dev',
      args: ['npm', 'run', 'dev'],
      detached: false
    },
    {
      slug: 'c9',
      name: 'npm start',
      args: ['npm', 'start'],
      detached: false
    },
    {
      slug: 'c10',
      name: 'npm start',
      args: ['npm', 'start'],
      detached: false
    },
    {
      slug: 'c11',
      name: 'npm start',
      args: ['npm', 'start'],
      detached: false
    },
    {
      slug: 'c12',
      name: 'npm start',
      args: ['npm', 'start'],
      detached: false
    },
    {
      slug: 'c13',
      name: 'npm run watch',
      args: ['npm', 'run', 'watch'],
      detached: false
    },
    {
      slug: 'c14',
      name: 'npm start',
      args: ['npm', 'start'],
      detached: false
    }
  ]
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
