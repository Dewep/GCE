const Vue = require('vue')

const state = {
  opened: {
    'p1': true,
    'p2': true
  },

  list: [
    {
      slug: 'p1',
      name: 'General',
      directories: ['d1']
    },
    {
      slug: 'p2',
      name: 'PandaLab Main',
      directories: ['d2', 'd3', 'd4', 'd5', 'd6', 'd7']
    }
  ]
}

const getters = {
  projects: state => state.list || [],

  getProject: (state, getters) => projectSlug => getters.projects.find(item => item.slug === projectSlug) || null,

  isProjectOpened: state => projectSlug => state.opened[projectSlug] !== false,

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
  toggleSidebarProject (store, { projectSlug }) {
    store.commit('SET_PROJECT_OPENED', { projectSlug, value: !store.getters.isProjectOpened(projectSlug) })
  }
}

const mutations = {
  SET_PROJECT_OPENED (state, { projectSlug, value }) {
    Vue.set(state.opened, projectSlug, value)
  }
}

module.exports = { state, getters, actions, mutations }
