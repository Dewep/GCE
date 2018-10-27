const state = {
  process: {
    'd1': {
      'c6': {
        status: 'starting',
        unread: false
      },
      'c7': {
        status: 'started',
        unread: false
      }
    },
    'd2': {
      'c8': {
        status: 'running',
        unread: true
      }
    },
    'd3': {
      'c9': {
        status: 'running',
        unread: false
      }
    },
    'd5': {
      'c11': {
        status: 'error',
        unread: false
      }
    },
    'd6': {
      'c12': {
        status: 'stopped',
        unread: false
      }
    },
    'd7': {
      'c13': {
        status: 'running',
        unread: false
      },
      'c14': {
        status: 'running',
        unread: false
      }
    }
  }
}

const getters = {
  getProcess: state => (directorySlug, commandSlug) => (state.process[directorySlug] && state.process[directorySlug][commandSlug]) || null,

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
}

const mutations = {
}

module.exports = { state, getters, actions, mutations }
