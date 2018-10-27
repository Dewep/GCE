const state = {
  directories: {
    'd4': {
      loading: false,
      edition: 0,
      originUp: 1,
      originDown: 3
    },
    'd5': {
      loading: true,
      edition: 0,
      originUp: 0,
      originDown: 0
    },
    'd6': {
      loading: false,
      edition: 0,
      originUp: 2,
      originDown: 0
    },
    'd7': {
      loading: false,
      edition: 10,
      originUp: 0,
      originDown: 1
    }
  }
}

const getters = {
  getGitStatus: state => directorySlug => state.directories[directorySlug] || null
}

const actions = {
}

const mutations = {
}

module.exports = { state, getters, actions, mutations }
