<template>
  <div class="main-content">
    <h4>Commands</h4>

    <div class="commands-list">
      <commands-list-item
        v-for="command in directory.commands"
        :key="command.slug"
        :command-slug="command.slug"
        @runCommand="runCommand(command.slug)"
      />
    </div>

    <div
      v-for="group in directory.groups"
      :key="group.slug"
      class="commands-list"
    >
      <commands-list-item
        v-for="command in group.commands"
        :key="command.slug"
        :group-slug="group.slug"
        :command-slug="command.slug"
        @runCommand="runCommand(command.slug)"
      />
    </div>
  </div>
</template>

<script>
const { mapGetters } = require('vuex')
const CommandsListItem = require('../../../common/commands-list-item.vue')

module.exports = {
  name: 'project-directory-dashboard-commands',

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

  components: { CommandsListItem },

  computed: {
    ...mapGetters([
      'getSidebarDirectory',
      'getCommand'
    ]),
    directory () {
      return this.getSidebarDirectory(this.directorySlug)
    }
  },

  methods: {
    runCommand (commandSlug) {
      console.info('Run command', commandSlug)
    }
  }
}
</script>
