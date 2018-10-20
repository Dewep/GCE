<template>
  <div class="sidebar flex-column">
    <div class="flex-extensible">
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
            exact
            class="directory-title flex-row"
          >
            <h2 class="flex-extensible-fixed">{{ directory.name }}</h2>
            <sup v-show="directory.gitOriginUp" class="flex-fixed code extra-info git-origin-up">{{ directory.gitOriginUp }}⇗</sup>
            <sup v-show="directory.gitOriginDown" class="flex-fixed code extra-info git-origin-down">{{ directory.gitOriginDown }}⇙</sup>
            <sup v-show="directory.gitOriginLoading" class="flex-fixed code extra-info loading"/>
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

    <div class="flex-fixed flex-row footer">
      <router-link :to="{ name: 'home' }" class="flex-extensible-fixed">Home</router-link>
      <router-link :to="{ name: 'settings' }" class="flex-extensible-fixed">Settings</router-link>
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
