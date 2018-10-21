const Vue = require('vue')
const Router = require('vue-router')

const MainUIComponent = require('../components/main-ui.vue')

const DashboardComponent = require('../components/dashboard/index.vue')
const DashboardHomeComponent = require('../components/dashboard/home.vue')
const DashboardSettingsComponent = require('../components/dashboard/settings.vue')

const ProjectComponent = require('../components/project/index.vue')
const ProjectSettingsComponent = require('../components/project/settings.vue')

const DirectoryComponent = require('../components/project/directory/index.vue')

const DirectoryDashboardComponent = require('../components/project/directory/dashboard/index.vue')
const DirectoryDashboardCommandsComponent = require('../components/project/directory/dashboard/commands.vue')
const DirectoryDashboardGitComponent = require('../components/project/directory/dashboard/git.vue')
const DirectoryDashboardSettingsComponent = require('../components/project/directory/dashboard/settings.vue')

const DirectoryCommandComponent = require('../components/project/directory/command.vue')

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '',
      component: MainUIComponent,
      children: [
        {
          path: '/dashboard',
          component: DashboardComponent,
          children: [
            { name: 'dashboard-home', path: '', component: DashboardHomeComponent },
            { name: 'dashboard-settings', path: 'settings', component: DashboardSettingsComponent }
          ]
        },
        {
          path: '/project/:projectSlug',
          component: ProjectComponent,
          props: true,
          children: [
            { name: 'project', path: '', component: ProjectSettingsComponent, props: true },
            {
              path: 'directory/:directorySlug',
              component: DirectoryComponent,
              props: true,
              children: [
                {
                  path: 'dashboard',
                  component: DirectoryDashboardComponent,
                  props: true,
                  children: [
                    { name: 'directory', path: '', redirect: '/project/:projectSlug/directory/:directorySlug/dashboard/commands' },
                    { name: 'directory-commands', path: 'commands', component: DirectoryDashboardCommandsComponent, props: true },
                    { name: 'directory-git', path: 'git', component: DirectoryDashboardGitComponent, props: true },
                    { name: 'directory-settings', path: 'settings', component: DirectoryDashboardSettingsComponent, props: true }
                  ]
                },
                { name: 'command', path: 'command/:commandSlug', component: DirectoryCommandComponent, props: true }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: '/dashboard'
    }
  ]
})

module.exports = router
