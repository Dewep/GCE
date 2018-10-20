const Vue = require('vue')
const Vuex = require('vuex')

const modules = require('./modules')
const plugins = require('./plugins')

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  plugins,
  strict: true
})

module.exports = store
