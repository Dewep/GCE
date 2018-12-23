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
          <small>{{ GCEVersion }}</small>
        </router-link>
      </center>

      <div
        v-for="project in sidebarProjects"
        :key="project.slug"
        :class="{ opened: project.opened }"
        class="project"
      >
        <router-link
          :to="{ name: 'project', params: { projectSlug: project.slug } }"
          exact
          class="project-title flex-row"
        >
          <h2 class="flex-extensible-fixed">{{ project.name }}</h2>
          <a class="flex-fixed code toggle-open" @click.prevent="toggleSidebarProject({ projectSlug: project.slug })"><span>⇵</span></a>
        </router-link>

        <div
          v-for="directory in project.directories"
          :key="directory.slug"
          class="directory"
        >
          <router-link
            :to="{ name: 'directory', params: { projectSlug: project.slug, directorySlug: directory.slug } }"
            class="directory-title flex-row"
          >
            <h2 class="flex-extensible-fixed">{{ directory.name }}</h2>
            <router-link
              :to="{ name: 'directory-git', params: { projectSlug: project.slug, directorySlug: directory.slug } }"
              active-class="no-active-class"
              class="flex-fixed code extra-git"
            >
              <template v-if="directory.git">
                <span v-show="directory.git.edition" class="git-modifs"><span>{{ directory.git.edition }}✎</span></span>
                <span v-show="directory.git.originUp" class="git-origin-up"><span>{{ directory.git.originUp }}⇙</span></span>
                <span v-show="directory.git.originDown" class="git-origin-down"><span>{{ directory.git.originDown }}⇙</span></span>
                <span v-show="directory.git.loading" class="loading-sm"/>
              </template>
            </router-link>
          </router-link>

          <router-link
            v-for="command in directory.commands"
            :key="directory.slug + '/' + command.slug"
            :to="{ name: 'command', params: { projectSlug: project.slug, directorySlug: directory.slug, commandSlug: command.slug } }"
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
const { mapGetters, mapActions } = require('vuex')

module.exports = {
  name: 'sidebar',

  computed: {
    ...mapGetters([
      'sidebarProjects',
      'GCEVersion'
    ])
  },

  methods: {
    ...mapActions([
      'toggleSidebarProject'
    ])
  }
}
</script>
