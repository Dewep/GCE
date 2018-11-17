<template>
  <form v-if="!commandSlug && !commandArgs" class="not-so-large" @submit.prevent="setNewCommand">
    <label :for="_uid + '-form-command-single-line'">Command</label>
    <input
      :id="_uid + '-form-command-single-line'"
      v-model="commandSingleLine"
      type="text"
      placeholder="Your command (e.g. 'npm run dev')"
      autofocus
    >
    <blockquote>You can use <code>%dir%</code> to have the current directory.<br>More options are available in the next step.</blockquote>

    <footer>
      <button
        type="button"
        class="btn btn-link"
        @click.prevent="close"
      >
        <template>Cancel</template>
      </button>
      <button type="submit" class="btn">Next</button>
    </footer>
  </form>

  <form v-else-if="commandArgs" class="not-so-large" @submit.prevent="submit">
    <label :for="_uid + '-form-command-name'">Command name</label>
    <input
      :id="_uid + '-form-command-name'"
      v-model="commandName"
      type="text"
      placeholder="Command name"
      autofocus
    >

    <label :for="_uid + '-form-command-args-0'">Command arguments</label>
    <input
      v-for="(commandArg, $index) in commandArgs"
      :key="'form-command-args-' + $index"
      :id="_uid + '-form-command-args-' + $index"
      v-model="commandArgs[$index]"
      :placeholder="`Argument ${$index + 1}`"
      :style="{ opacity: commandArgs[$index] ? 1 : 0.3 }"
      type="text"
    >
    <blockquote>You can use <code>%dir%</code> to have the current directory.</blockquote>

    <label @click.prevent="commandDetached = !commandDetached">Detached command</label>
    <button
      type="button"
      class="btn btn-link"
      @click.prevent="commandDetached = !commandDetached"
    >
      <template>{{ commandDetached ? 'Yes' : 'No' }}</template>
    </button>
    <blockquote>If yes, the stdout will not be watched (useful for commands that run external windows, like "<code>explorer.exe</code>", "<code>vscode</code>", etc.).</blockquote>

    <footer>
      <button
        type="button"
        class="btn btn-link"
        @click.prevent="close"
      >
        <template>Cancel</template>
      </button>
      <button
        type="button"
        class="btn btn-error"
        @click.prevent="remove"
      >
        <template>Remove</template>
      </button>
      <button type="submit" class="btn">{{ commandSlug ? 'Update' : 'Add' }}</button>
    </footer>
  </form>
</template>

<script>
const { mapGetters, mapActions } = require('vuex')

module.exports = {
  name: 'common-command-form',

  props: {
    commandSlug: {
      type: String,
      default: null
    },
    directorySlug: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      commandSingleLine: '',
      commandName: '',
      commandArgs: null,
      commandDetached: false
    }
  },

  computed: {
    ...mapGetters([
      'getCommand'
    ]),
    command () {
      return this.getCommand(this.commandSlug)
    }
  },

  watch: {
    commandArgs: {
      handler () {
        if (this.commandArgs) {
          const size = this.commandArgs.length
          if (!size || this.commandArgs[size - 1]) {
            this.commandArgs.push('')
          } else if (size > 2 && !this.commandArgs[size - 2]) {
            this.commandArgs.splice(-1, 1)
          }
        }
      },
      immediate: true
    },

    command: {
      handler () {
        if (this.command) {
          this.commandName = this.command.name
          this.commandArgs = [...this.command.args]
          this.commandDetached = this.command.detached
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions([
      'commandUpdate',
      'commandCreate',
      'commandRemove'
    ]),

    close () {
      this.$emit('close')
    },

    setNewCommand () {
      if (this.commandSingleLine) {
        const args = this.commandSingleLine.split(' ')
        this.commandName = args.slice(0, 3).join(' ')
        this.commandArgs = args
        this.commandDetached = false
      }
    },

    submit () {
      const name = this.commandName
      const args = this.commandArgs.filter(arg => arg)
      const detached = this.commandDetached

      if (name && args.length) {
        if (this.commandSlug) {
          this.commandUpdate({ commandSlug: this.commandSlug, name, args, detached })
        } else if (this.directorySlug) {
          this.commandCreate({ directorySlug: this.directorySlug, name, args, detached })
        }
      }

      this.close()
    },

    remove () {
      const commandSlug = this.commandSlug
      const directorySlug = this.directorySlug
      const groupSlug = this.groupSlug

      if (commandSlug && (directorySlug || groupSlug)) {
        this.commandRemove({ commandSlug, directorySlug, groupSlug })
      }
    }
  }
}
</script>
