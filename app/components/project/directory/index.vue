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
      'getDirectory',
      'getProjectByDirectory'
    ]),
    project () {
      return this.getProject(this.projectSlug)
    },
    directory () {
      return this.getDirectory(this.directorySlug)
    }
  },

  watch: {
    directory: {
      handler () {
        const redirect = !this.directory || !this.project || !this.project.directories.includes(this.directorySlug)

        if (redirect) {
          if (this.directory) {
            const newProject = this.getProjectByDirectory(this.directorySlug)

            if (newProject) {
              return this.$router.push({ name: 'directory-settings', params: { projectSlug: newProject.slug, directorySlug: this.directorySlug } })
            }
          }

          this.$router.push({ name: 'project', params: { projectSlug: this.projectSlug } })
        }
      },
      immediate: true
    }
  }
}
</script>
