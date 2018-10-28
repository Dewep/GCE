<template>
  <router-view/>
</template>

<script>
const { mapGetters } = require('vuex')

module.exports = {
  name: 'project-directory',

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
      if (!this.project || !this.project.directories || !this.project.directories.includes(this.directorySlug)) {
        return null
      }
      return this.getDirectory(this.directorySlug)
    }
  },

  watch: {
    directory: {
      handler () {
        if (!this.directory || !this.project) {
          this.$router.push({ name: 'project', params: { projectSlug: this.projectSlug } })
        }
      },
      immediate: true
    }
  }
}
</script>
