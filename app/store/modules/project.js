const path = window.nodeRequire('path')
const Vue = require('vue')
const storage = require('../storage')
const identifer = require('../identifier')

const state = {
  opened: {
    'p1': true,
    'p2': true
  },

  list: storage.array('projects'),

  autoDefinitionStatus: {}
}

const getters = {
  projects: state => state.list || [],

  getProject: (state, getters) => projectSlug => getters.projects.find(item => item.slug === projectSlug) || null,

  isProjectOpened: state => projectSlug => state.opened[projectSlug] !== false,

  getProjectByDirectory: (state, getters) => directorySlug => getters.projects.find(item => item.directories.includes(directorySlug)) || null,

  getProjectAutoDefinitionStatus: state => projectSlug => state.autoDefinitionStatus[projectSlug] || { loading: false, error: null },

  getProjectAutoDefinition: (state, getters) => projectSlug => {
    const project = getters.getProject(projectSlug)

    if (!project || !project.path || !project.autoDefinition || !project.autoDefinition.length) {
      return []
    }

    const currentDirectoryPaths = (project.directories || [])
      .map(directorySlug => getters.getDirectory(directorySlug))
      .map(item => item && item.path)
      .filter(item => item)

    return project.autoDefinition
      .map(def => {
        const clonePath = path.join(project.path, def.directory)
        const directoryPath = def.root ? path.join(clonePath, def.root) : clonePath
        return {
          ...def,
          clonePath,
          directoryPath
        }
      })
      .filter(def => !currentDirectoryPaths.includes(def.directoryPath))
  },

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

  async projectCreate (store, { name, url, path, autoDefinition, directories }) {
    const projectSlug = identifer('p')
    name = name || projectSlug
    url = url || null
    path = path || null
    autoDefinition = autoDefinition || []
    directories = directories || []

    if (!path && url) {
      throw new Error('The rootpath must be defined if you set an auto-definition URL')
    }

    store.commit('PROJECT_CREATE', { projectSlug, name, url, path, autoDefinition, directories })

    return projectSlug
  },

  async projectUpdate (store, { projectSlug, name, url, path, autoDefinition, directories }) {
    const project = store.getters.getProject(projectSlug)

    if (!project) {
      throw new Error('Project not found')
    }

    name = name || project.name
    url = url || project.url
    path = path || project.path
    autoDefinition = autoDefinition || project.autoDefinition || []
    directories = directories || project.directories

    if (!path && url) {
      throw new Error('The rootpath must be defined if you set an auto-definition URL')
    }

    store.commit('PROJECT_UDPATE', { projectSlug, name, url, path, autoDefinition, directories })

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
  },

  async projectLoadAutoDefinition (store, { projectSlug }) {
    try {
      store.commit('PROJECT_AUTO_DEFINITION_STATUS_SET', { projectSlug, loading: true, error: null })

      const project = store.getters.getProject(projectSlug)

      if (!project) {
        throw new Error('Project not found')
      }
      if (!project.url) {
        throw new Error('This project does not have an auto-definition URL')
      }
      if (!project.path) {
        throw new Error('This project does not have a rootpath to create directories')
      }

      const response = await fetch(project.url)
      const json = await response.json()

      const directories = []
      for (const directory of (json.directories || [])) {
        if (directory.git) {
          const data = {}
          data.git = directory.git
          data.directory = (directory.directory || data.git).split('/').pop().replace('.git', '')
          data.name = directory.name || data.directory
          if (directory.root) {
            data.root = directory.root
          }
          directories.push(data)
        }
      }

      await store.dispatch('projectUpdate', { projectSlug, name: json.name || null, autoDefinition: directories })

      store.commit('PROJECT_AUTO_DEFINITION_STATUS_SET', { projectSlug, loading: false, error: null })
    } catch (err) {
      console.warn('[projectLoadAutoDefinition]', err)
      store.commit('PROJECT_AUTO_DEFINITION_STATUS_SET', { projectSlug, loading: false, error: err.message })
    }
  }
}

const mutations = {
  PROJECT_OPENED (state, { projectSlug, value }) {
    Vue.set(state.opened, projectSlug, value)
  },

  PROJECT_CREATE (state, { projectSlug, name, url, path, autoDefinition, directories }) {
    state.list = [
      ...state.list,
      {
        slug: projectSlug,
        name,
        url,
        path,
        autoDefinition,
        directories
      }
    ]

    storage.array('projects', state.list)
  },

  PROJECT_UDPATE (state, { projectSlug, name, url, path, autoDefinition, directories }) {
    state.list = state.list.map(project => {
      if (project.slug !== projectSlug) {
        return project
      }

      return {
        slug: project.slug,
        name,
        url,
        path,
        autoDefinition,
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

        mutations.PROJECT_UDPATE(state, {
          projectSlug,
          name: project.name,
          url: project.url,
          path: project.path,
          autoDefinition: project.autoDefinition,
          directories
        })
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
  },

  PROJECT_AUTO_DEFINITION_STATUS_SET (state, { projectSlug, loading, error }) {
    Vue.set(state.autoDefinitionStatus, projectSlug, { loading, error })
  }
}

module.exports = { state, getters, actions, mutations }
