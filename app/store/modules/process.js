const Vue = require('vue')

const state = {
  process: {},
  processOutput: {}
}

const getters = {
  getProcess: state => (directorySlug, commandSlug) => (state.process[directorySlug] && state.process[directorySlug][commandSlug]) || null,

  getProcessOutput: state => (directorySlug, commandSlug) => (state.processOutput[directorySlug] && state.processOutput[directorySlug][commandSlug]) || null,

  getProcessStatus: (state, getters) => (directorySlug, commandSlug) => {
    const process = getters.getProcess(directorySlug, commandSlug)
    return (process && process.status) || 'stopped'
  },

  getProcessUnread: (state, getters) => (directorySlug, commandSlug) => {
    const process = getters.getProcess(directorySlug, commandSlug)
    return (process && process.unread) || false
  }
}

const actions = {
  async processStart ({ commit }, { directorySlug, commandSlug }) {
    commit('PROCESS_START', { directorySlug, commandSlug })
  },
  async processStop ({ commit }, { directorySlug, commandSlug }) {
    commit('PROCESS_STOP', { directorySlug, commandSlug })
  },
  async processRetart ({ commit }, { directorySlug, commandSlug }) {
    commit('PROCESS_RESTART', { directorySlug, commandSlug })
  },

  async processUpdate ({ commit }, { directorySlug, commandSlug, status }) {
    commit('PROCESS_UPDATE', { directorySlug, commandSlug, status })
  },

  async processOutputAddContent ({ commit }, { directorySlug, commandSlug, type, content }) {
    commit('PROCESS_OUTPUT_ADD_CONTENT', { directorySlug, commandSlug, type, content })
  }
}

function stdContentToHtml (str) {
  str = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/ /g, '&nbsp;')
  str = '<span>' + str
  for (let index in this.colors) {
    let color = this.colors[index]
    str = str.replace(color.pattern, '</span><span style="color:' + color.color + '">')
  }
  str += '</span>'
  return str.replace(/\n/g, '<br>')
}

const mutations = {
  PROCESS_START (state, { directorySlug, commandSlug }) {},
  PROCESS_STOP (state, { directorySlug, commandSlug }) {},
  PROCESS_RESTART (state, { directorySlug, commandSlug }) {},

  PROCESS_UPDATE (state, { directorySlug, commandSlug, status, unread }) {
    if (!state.process[directorySlug]) {
      Vue.set(state.process, directorySlug, {})
    }
    Vue.set(state.process[directorySlug], commandSlug, { status, unread })
  },

  PROCESS_OUTPUT_ADD_CONTENT (state, { directorySlug, commandSlug, type, content }) {
    if (!state.processOutput[directorySlug]) {
      Vue.set(state.processOutput, directorySlug, {})
    }
    if (!state.processOutput[directorySlug][commandSlug]) {
      Vue.set(state.processOutput[directorySlug], commandSlug, { lines: [] })
    }
    const html = stdContentToHtml(content)
    const size = 1 + (html.match(/\n/g) || []).length
    const time = (new Date()).toLocaleTimeString()
    const lines = [...state.processOutput[directorySlug][commandSlug].lines, { type, html, size, time }]
    Vue.set(state.processOutput[directorySlug][commandSlug], 'lines', lines)
  }
}

module.exports = { state, getters, actions, mutations }
