<template>
  <div class="commands-list-item">
    <div :class="{ 'with-group': group }" class="main">
      <a class="description" @click.prevent="run">
        <h5>
          <template>{{ command.name }}</template>
          <span v-show="command.detached" class="code">🗗</span>
        </h5>
        <p class="code">{{ commandLine }}</p>
      </a>

      <a class="edition" @click.prevent="commandModal = true">✎</a>

      <modal :active.sync="commandModal" title="Command edition">
        <command-form
          :command-slug="command.slug"
          :directory-slug="directorySlug"
          :group-slug="groupSlug"
          @close="commandModal = false"
        />
      </modal>
    </div>

    <router-link
      v-if="group"
      :to="{ name: 'dashboard-home' }"
      class="group"
    >
      <template>{{ group.name }}</template>
    </router-link>
  </div>
</template>

<script>
const { mapGetters } = require('vuex')
const Modal = require('./modal.vue')
const CommandForm = require('./command-form.vue')

module.exports = {
  name: 'commands-list-item',

  props: {
    commandSlug: {
      type: String,
      required: true
    },
    directorySlug: {
      type: String,
      default: null
    },
    groupSlug: {
      type: String,
      default: null
    }
  },

  components: { Modal, CommandForm },

  data () {
    return {
      commandModal: false
    }
  },

  computed: {
    ...mapGetters([
      'getGroup',
      'getCommand'
    ]),
    group () {
      return (this.groupSlug && this.getGroup(this.groupSlug)) || null
    },
    command () {
      return this.getCommand(this.commandSlug)
    },
    commandLine () {
      return this.command.args.join(' ')
    }
  }
}
</script>
