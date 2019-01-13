<template>
  <div class="flex-column">
    <div class="flex-fixed topbar">
      <h1>{{ directory.name }} / {{ command.name }}<small>{{ directory.path }}</small></h1>
    </div>

    <div ref="scrollableContent" class="flex-extensible">
      <b>Status: {{ process && process.status || 'N/A' }}</b><br>
      <div
        v-for="(line, $index) in lines"
        :key="'content-' + $index"
        :data-time="line.time"
        :class="line.type"
        v-html="line.html"
      />
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
      'getProcess',
      'getProcessOutput'
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
    },
    processOutput () {
      return this.getProcessOutput(this.directorySlug, this.commandSlug)
    },
    lines () {
      return (this.processOutput && this.processOutput.lines) || []
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
