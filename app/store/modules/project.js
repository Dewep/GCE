const Vue = require('vue')
const storage = require('../storage')
const identifer = require('../identifier')

const state = {
  opened: {
    'p1': true,
    'p2': true
  },

  list: storage.array('projects')
}

const getters = {
  projects: state => state.list || [],

  getProject: (state, getters) => projectSlug => getters.projects.find(item => item.slug === projectSlug) || null,

  isProjectOpened: state => projectSlug => state.opened[projectSlug] !== false,

  getProjectByDirectory: (state, getters) => directorySlug => getters.projects.find(item => item.directories.includes(directorySlug)) || null,

  getSidebarProject: (state, getters) => projectSlug => {
    const project = getters.getProject(projectSlug)

    if (!project) {
      return null
    }

    const directories = (project.directories || [])
      .map(directorySlug => getters.getSidebarDirectory(directorySlug))
      .filter(item => item)

    return {
      ...project,
      opened: getters.isProjectOpened(project.slug),
      directories
    }
  },

  sidebarProjects: (state, getters) => {
    return getters.projects
      .map(projectDefinition => getters.getSidebarProject(projectDefinition.slug))
      .filter(item => item)
  }
}

const actions = {
  async toggleSidebarProject (store, { projectSlug }) {
    store.commit('PROJECT_OPENED', { projectSlug, value: !store.getters.isProjectOpened(projectSlug) })
  },

  async projectCreate (store, { name, directories }) {
    const projectSlug = identifer('p')
    name = name || projectSlug
    directories = directories || []

    store.commit('PROJECT_CREATE', { projectSlug, name, directories })

    return projectSlug
  },

  async projectUpdate (store, { projectSlug, name, directories }) {
    const project = store.getters.getProject(projectSlug)

    if (!project) {
      throw new Error('Project not found')
    }

    name = name || project.name
    directories = directories || project.directories

    store.commit('PROJECT_UDPATE', { projectSlug, name, directories })

    return projectSlug
  },

  async projectPositionUp (store, { projectSlug }) {
    store.commit('PROJECT_POSITION', { projectSlug, position: -1 })
  },

  async projectPositionDown (store, { projectSlug }) {
    store.commit('PROJECT_POSITION', { projectSlug, position: 1 })
  },

  async directoryPositionUp (store, { projectSlug, directorySlug }) {
    store.commit('PROJECT_DIRECTORY_POSITION', { projectSlug, directorySlug, position: -1 })
  },

  async directoryPositionDown (store, { projectSlug, directorySlug }) {
    store.commit('PROJECT_DIRECTORY_POSITION', { projectSlug, directorySlug, position: 1 })
  },

  async projectDirectoryMove (store, { projectSlug, directorySlug }) {
    store.commit('PROJECT_DIRECTORY_MOVE', { projectSlug, directorySlug })
  },

  async projectRemove (store, { projectSlug }) {
    const project = store.getters.getProject(projectSlug)

    if (!project) {
      throw new Error('Project not found')
    }

    store.commit('PROJECT_REMOVE', { projectSlug })
  }
}

const mutations = {
  PROJECT_OPENED (state, { projectSlug, value }) {
    Vue.set(state.opened, projectSlug, value)
  },

  PROJECT_CREATE (state, { projectSlug, name, directories }) {
    state.list = [
      ...state.list,
      {
        slug: projectSlug,
        name,
        directories
      }
    ]

    storage.array('projects', state.list)
  },

  PROJECT_UDPATE (state, { projectSlug, name, directories }) {
    state.list = state.list.map(project => {
      if (project.slug !== projectSlug) {
        return project
      }

      return {
        slug: project.slug,
        name,
        directories
      }
    })

    storage.array('projects', state.list)
  },

  PROJECT_POSITION (state, { projectSlug, position }) {
    state.list = [...state.list]
    const index = state.list.findIndex(p => p.slug === projectSlug)
    const newIndex = index + position

    if (index >= 0 && newIndex >= 0 && newIndex < state.list.length) {
      const tmp = state.list[newIndex]
      state.list[newIndex] = state.list[index]
      state.list[index] = tmp

      storage.array('projects', state.list)
    }
  },

  PROJECT_DIRECTORY_POSITION (state, { projectSlug, directorySlug, position }) {
    const project = state.list.find(p => p.slug === projectSlug)

    if (project) {
      const directories = [...project.directories]
      const index = directories.indexOf(directorySlug)
      const newIndex = index + position

      if (index >= 0 && newIndex >= 0 && newIndex < directories.length) {
        const tmp = directories[newIndex]
        directories[newIndex] = directories[index]
        directories[index] = tmp

        mutations.PROJECT_UDPATE(state, { projectSlug, name: project.name, directories })
      }
    }
  },

  PROJECT_DIRECTORY_MOVE (state, { projectSlug, directorySlug }) {
    state.list = [...state.list]
    const oldProject = state.list.find(p => p.directories.includes(directorySlug))
    const newProject = state.list.find(p => p.slug === projectSlug)

    if (oldProject) {
      oldProject.directories = oldProject.directories.filter(d => d !== directorySlug)
    }

    if (newProject) {
      newProject.directories.push(directorySlug)
    }

    storage.array('projects', state.list)
  },

  PROJECT_REMOVE (state, { projectSlug }) {
    state.list = [...state.list].filter(p => p.slug !== projectSlug)

    storage.array('projects', state.list)
  }
}

module.exports = { state, getters, actions, mutations }
