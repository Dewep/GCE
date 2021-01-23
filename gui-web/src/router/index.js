import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/dashboard.vue'
import ProjectIndex from '../views/project-index.vue'
import ProjectHome from '../views/project-home.vue'
import ProjectStream from '../views/project-stream.vue'
import DirectoryIndex from '../views/directory-index.vue'
import DirectoryHome from '../views/directory-home.vue'
import DirectoryStream from '../views/directory-stream.vue'
import ViewStream from '../views/stream.vue'

const routes = [
  {
    name: 'dashboard',
    path: '/',
    component: Dashboard
  },
  {
    name: 'stream',
    path: '/s/:streamSlug',
    component: ViewStream,
    props: true
  },
  {
    path: '/p/:projectSlug',
    component: ProjectIndex,
    props: true,
    children: [
      {
        name: 'project',
        path: '',
        component: ProjectHome,
        props: true
      },
      {
        name: 'project-stream',
        path: 's/:streamSlug',
        component: ProjectStream,
        props: true
      },
      {
        path: 'd/:directorySlug',
        component: DirectoryIndex,
        props: true,
        children: [
          {
            name: 'directory',
            path: '',
            component: DirectoryHome,
            props: true
          },
          {
            name: 'directory-stream',
            path: 's/:streamSlug',
            component: DirectoryStream,
            props: true
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
