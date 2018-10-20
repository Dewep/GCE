const Vue = require('vue')
const Router = require('vue-router')

const MainUIComponent = require('../components/main-ui.vue')

const HomeComponent = require('../components/home.vue')
const SettingsComponent = require('../components/settings.vue')

const ProjectComponent = require('../components/project/index.vue')
const ProjectSettingsComponent = require('../components/project/settings.vue')
const DirectoryComponent = require('../components/project/directory/index.vue')
const DirectorySettingsComponent = require('../components/project/directory/settings.vue')
const DirectoryCommandComponent = require('../components/project/directory/command.vue')

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '',
      component: MainUIComponent,
      children: [
        { name: 'home', path: '/', component: HomeComponent },
        { name: 'settings', path: '/settings', component: SettingsComponent },
        {
          path: '/project/:projectSlug',
          component: ProjectComponent,
          children: [
            { name: 'project', path: '', component: ProjectSettingsComponent, props: true },
            {
              path: ':directorySlug',
              component: DirectoryComponent,
              children: [
                { name: 'directory', path: '', component: DirectorySettingsComponent, props: true },
                { name: 'command', path: ':commandSlug', component: DirectoryCommandComponent, props: true }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

module.exports = router
