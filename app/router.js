import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './views/dashboard.vue'
import ProjectIndex from './views/project-index.vue'
import ProjectHome from './views/project-home.vue'
import DirectoryIndex from './views/directory-index.vue'
import DirectoryHome from './views/directory-home.vue'
import DirectoryStream from './views/directory-stream.vue'

const routerHistory = createWebHistory('/')

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      name: 'dashboard',
      path: '/',
      component: Dashboard
    },
    {
      path: '/p/:projectSlug',
      component: ProjectIndex,
      props: true,
      children: [
        {
          name: 'project',
          path: '/',
          component: ProjectHome,
          props: true
        },
        {
          path: '/d/:directorySlug',
          component: DirectoryIndex,
          props: true,
          children: [
            {
              name: 'directory',
              path: '/',
              component: DirectoryHome,
              props: true
            },
            {
              name: 'directory-stream',
              path: '/s/:streamSlug',
              component: DirectoryStream,
              props: true
            }
          ]
        }
      ]
    }
  ]
})

export default router
