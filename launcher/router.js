import { createRouter, createWebHistory } from 'vue-router'
import Config from './views/config.vue'
import GCE from './views/gce.vue'

const router = createRouter({
  history: createWebHistory('#'),

  routes: [
    {
      name: 'config',
      path: '/',
      component: Config
    },
    {
      name: 'gce',
      path: '/gce',
      component: GCE
    }
  ]
})

export default router
