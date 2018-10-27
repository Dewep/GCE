<template>
  <div class="flex-column">
    <div class="flex-fixed topbar">
      <h1>{{ project.name }} / {{ directory.name }}<small>{{ directory.path }}</small></h1>
      <nav>
        <router-link :to="{ name: 'directory-commands', params: { projectSlug, directorySlug } }">Commands</router-link>
        <router-link v-if="directory.git" :to="{ name: 'directory-git', params: { projectSlug, directorySlug } }">GIT</router-link>
        <router-link :to="{ name: 'directory-settings', params: { projectSlug, directorySlug } }">Settings</router-link>
      </nav>
    </div>
    <router-view class="flex-extensible"/>
  </div>
</template>

<script>
const { mapGetters } = require('vuex')

module.exports = {
  name: 'project-directory-dashboard',

  props: {
    projectSlug: {
      type: String,
      required: true
    },
    directorySlug: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'getProject',
      'getDirectory'
    ]),
    project () {
      return this.getProject(this.projectSlug)
    },
    directory () {
      return this.getDirectory(this.directorySlug)
    }
  }
}
</script>
