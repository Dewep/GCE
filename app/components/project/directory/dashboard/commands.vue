<template>
  <div class="main-content">
    <h4>Commands</h4>

    <div class="commands-list">
      <commands-list-item
        v-for="command in directory.commands"
        :key="command.slug"
        :command-slug="command.slug"
        :directory-slug="directorySlug"
        @runCommand="runCommand(command.slug)"
      />
    </div>

    <div class="commands-list mb-20">
      <div class="commands-list-item commands-list-item-extra">
        <div class="main">
          <a class="description" @click.prevent="newCommandModal = true">
            <h5>+ Add a new command...</h5>
          </a>

          <modal :active.sync="newCommandModal" :title="`New command for ${directory.name}`">
            <command-form
              :directory-slug="directorySlug"
              @close="newCommandModal = false"
            />
          </modal>
        </div>
      </div>
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
const Modal = require('../../../common/modal.vue')
const CommandForm = require('../../../common/command-form.vue')

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

  components: { CommandsListItem, Modal, CommandForm },

  data () {
    return {
      newCommandModal: false
    }
  },

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
