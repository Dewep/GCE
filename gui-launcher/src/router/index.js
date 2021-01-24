import { createRouter, createWebHashHistory } from 'vue-router'
import Config from '../views/config.vue'
import GCE from '../views/gce.vue'

const routes = [
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

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
