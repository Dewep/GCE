import { createRouter } from 'vue-router'
import Config from '../views/dashboard.vue'
import GCE from '../views/project-index.vue'

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
  routes
})

export default router
