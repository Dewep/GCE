const Vue = require('vue')

const router = require('./router')
const store = require('./store')
const App = require('./app.vue')

// Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  render: h => h(App)
})

router.onReady(() => {
  app.$mount('#app')
})
