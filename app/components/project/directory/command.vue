<template>
  <div class="flex-column">
    <div class="flex-fixed topbar">
      <h1>{{ directory.name }} / {{ command.name }}<small>{{ directory.path }}</small></h1>
    </div>

    <div class="flex-extensible">
      <p>...</p>
    </div>
  </div>
</template>

<script>
const { mapGetters } = require('vuex')

module.exports = {
  name: 'project-directory-command',

  props: {
    projectSlug: {
      type: String,
      required: true
    },
    directorySlug: {
      type: String,
      required: true
    },
    commandSlug: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'getProject',
      'getDirectory',
      'getCommand',
      'getProcess'
    ]),
    project () {
      return this.getProject(this.projectSlug)
    },
    directory () {
      return this.getDirectory(this.directorySlug)
    },
    command () {
      return this.getCommand(this.commandSlug)
    },
    process () {
      return this.getProcess(this.directorySlug, this.commandSlug)
    }
  },

  watch: {
    command: {
      handler () {
        if (!this.project || !this.directory || !this.command) {
          this.$router.push({ name: 'directory', params: { projectSlug: this.projectSlug, directorySlug: this.directorySlug } })
        }
      },
      immediate: true
    }
  }
}
</script>
