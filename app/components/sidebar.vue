<template>
  <div class="sidebar flex-column">
    <div class="flex-extensible">
      <center>
        <router-link
          :to="{ name: 'dashboard-home' }"
          class="dashboard"
        >
          <img src="icon.png">
          <b>Dashboard GCE</b>
          <small>2.0.0</small>
        </router-link>
      </center>

      <div
        v-for="project in projects"
        :key="project.name"
        class="project"
      >
        <router-link
          :to="{ name: 'project', params: { projectSlug: project.name } }"
          :class="{ opened: project.open }"
          exact
          class="project-title flex-row"
        >
          <h2 class="flex-extensible-fixed">{{ project.name }}</h2>
          <a class="flex-fixed code toggle-open" @click.prevent="project.open = !project.open"><span>⇵</span></a>
        </router-link>

        <div
          v-for="directory in project.directories"
          :key="project.name + '/' + directory.name"
          class="directory"
        >
          <router-link
            :to="{ name: 'directory', params: { projectSlug: project.name, directorySlug: directory.name } }"
            class="directory-title flex-row"
          >
            <h2 class="flex-extensible-fixed">{{ directory.name }}</h2>
            <router-link
              :to="{ name: 'directory-git', params: { projectSlug: project.name, directorySlug: directory.name } }"
              active-class="no-active-class"
              class="flex-fixed code extra-git"
            >
              <span v-show="directory.gitEdition" class="git-modifs"><span>{{ directory.gitEdition }}✎</span></span>
              <span v-show="directory.gitOriginUp" class="git-origin-up"><span>{{ directory.gitOriginUp }}⇙</span></span>
              <span v-show="directory.gitOriginDown" class="git-origin-down"><span>{{ directory.gitOriginDown }}⇙</span></span>
              <span v-show="directory.gitOriginLoading" class="loading"/>
            </router-link>
          </router-link>

          <router-link
            v-for="command in directory.commands"
            :key="project.name + '/' + directory.name + '/' + command.name"
            :to="{ name: 'command', params: { projectSlug: project.name, directorySlug: directory.name, commandSlug: command.name } }"
            :class="['status-' + command.status]"
            exact
            class="command flex-row"
          >
            <h2 class="flex-extensible-fixed code">{{ command.name }}</h2>
            <sup v-show="command.unread" class="flex-fixed code unread"><span>•</span></sup>
            <a class="flex-fixed code restart"><span>↻</span></a>
            <a class="flex-fixed code stop"><span>■</span></a>
            <a class="flex-fixed code start"><span>►</span></a>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'sidebar',

  data () {
    return {
      projects: [
        {
          name: 'General',
          open: true,
          directories: [
            {
              name: 'Vagrant',
              commands: [
                {
                  name: 'vagrant up',
                  status: 'starting'
                },
                {
                  name: 'vagrant up 2',
                  status: 'started'
                }
              ]
            }
          ]
        },
        {
          name: 'PandaLab Main',
          open: true,
          directories: [
            {
              name: 'App',
              commands: [
                {
                  name: 'npm run dev',
                  status: 'running',
                  unread: true
                }
              ]
            },
            {
              name: 'Team server',
              commands: [
                {
                  name: 'npm start',
                  status: 'running'
                }
              ]
            },
            {
              name: 'CDN',
              gitOriginUp: 1,
              gitOriginDown: 3,
              commands: [
                {
                  name: 'npm start',
                  status: 'stopped'
                }
              ]
            },
            {
              name: 'Balancer',
              gitOriginLoading: true,
              commands: [
                {
                  name: 'npm start',
                  status: 'error'
                }
              ]
            },
            {
              name: 'Asset-Maker',
              gitOriginUp: 2,
              commands: [
                {
                  name: 'npm start',
                  status: 'stopped'
                }
              ]
            },
            {
              name: 'Console',
              gitEdition: 10,
              gitOriginDown: 1,
              commands: [
                {
                  name: 'npm run watch',
                  status: 'running'
                },
                {
                  name: 'npm start',
                  status: 'running'
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
</script>
