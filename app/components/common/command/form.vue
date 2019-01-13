<template>
  <form v-if="!commandSlug && !commandStartArgs" class="not-so-large" @submit.prevent="setNewCommand">
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

  <form v-else-if="commandStartArgs" class="not-so-large" @submit.prevent="submit">
    <label :for="_uid + '-form-command-name'">Command name</label>
    <input
      :id="_uid + '-form-command-name'"
      v-model="commandName"
      type="text"
      placeholder="Command name"
      autofocus
    >

    <label :for="_uid + '-form-command-start-args-0'">
      <template v-if="commandHasStop">Start command arguments</template>
      <template v-else>Command arguments</template>
    </label>
    <input
      v-for="(commandArg, $index) in commandStartArgs"
      :key="'form-command-start-args-' + $index"
      :id="_uid + '-form-command-start-args-' + $index"
      v-model="commandStartArgs[$index]"
      :placeholder="`Argument ${$index + 1}`"
      :style="{ opacity: commandStartArgs[$index] ? 1 : 0.3 }"
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
    <blockquote>If yes, the command will not be run inside GCE (useful for commands that run external windows, like "<code>explorer.exe</code>", "<code>vscode</code>", etc.).</blockquote>

    <template v-if="!commandDetached">
      <label @click.prevent="commandHasStop = !commandHasStop">Has a stop command</label>
      <button
        type="button"
        class="btn btn-link"
        @click.prevent="commandHasStop = !commandHasStop"
      >
        <template>{{ commandHasStop ? 'Yes' : 'No' }}</template>
      </button>
      <blockquote>If yes, you will have to define a start and a stop command (useful for services like "<code>vagrant up</code>" + "<code>vagrant halt</code>", "<code>docker-compose up</code>" + "<code>docker-compose stop</code>", etc.).</blockquote>

      <template v-if="commandHasStop">
        <label :for="_uid + '-form-command-stop-args-0'">Stop command arguments</label>
        <input
          v-for="(commandArg, $index) in commandStopArgs"
          :key="'form-command-stop-args-' + $index"
          :id="_uid + '-form-command-stop-args-' + $index"
          v-model="commandStopArgs[$index]"
          :placeholder="`Argument ${$index + 1}`"
          :style="{ opacity: commandStopArgs[$index] ? 1 : 0.3 }"
          type="text"
        >
        <blockquote>You can use <code>%dir%</code> to have the current directory.</blockquote>
      </template>
    </template>

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
    },
    groupSlug: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      commandSingleLine: '',
      commandName: '',
      commandStartArgs: null,
      commandDetached: false,
      commandHasStop: false,
      commandStopArgs: null
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
    commandStartArgs: {
      handler () {
        if (this.commandStartArgs) {
          const size = this.commandStartArgs.length
          if (!size || this.commandStartArgs[size - 1]) {
            this.commandStartArgs.push('')
          } else if (size > 2 && !this.commandStartArgs[size - 2]) {
            this.commandStartArgs.splice(-1, 1)
          }
        }
      },
      immediate: true
    },

    commandStopArgs: {
      handler () {
        if (this.commandStopArgs) {
          const size = this.commandStopArgs.length
          if (!size || this.commandStopArgs[size - 1]) {
            this.commandStopArgs.push('')
          } else if (size > 2 && !this.commandStopArgs[size - 2]) {
            this.commandStopArgs.splice(-1, 1)
          }
        }
      },
      immediate: true
    },

    command: {
      handler () {
        if (this.command) {
          this.commandName = this.command.name
          this.commandStartArgs = [...this.command.args]
          this.commandDetached = this.command.detached
          this.commandHasStop = !!(!this.command.detached && this.command.stopArgs && this.command.stopArgs.length)
          this.commandStopArgs = this.commandHasStop ? [...this.command.stopArgs] : []
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
        this.commandStartArgs = args
        this.commandDetached = false
        this.commandHasStop = false
        this.commandStopArgs = []
      }
    },

    async submit () {
      const name = this.commandName
      const args = this.commandStartArgs.filter(arg => arg)
      const detached = this.commandDetached
      let stopArgs = !this.commandDetached && this.commandHasStop ? this.commandStopArgs.filter(arg => arg) : null
      if (stopArgs && !stopArgs.length) {
        stopArgs = null
      }

      if (name && args.length) {
        if (this.commandSlug) {
          await this.commandUpdate({ commandSlug: this.commandSlug, name, args, detached, stopArgs })
        } else if (this.directorySlug) {
          await this.commandCreate({ directorySlug: this.directorySlug, name, args, detached, stopArgs })
        } else if (this.groupSlug) {
          await this.commandCreate({ groupSlug: this.groupSlug, name, args, detached, stopArgs })
        }
      }

      this.close()
    },

    async remove () {
      const commandSlug = this.commandSlug
      const directorySlug = this.directorySlug
      const groupSlug = this.groupSlug

      if (commandSlug && (directorySlug || groupSlug)) {
        await this.commandRemove({ commandSlug, directorySlug, groupSlug })
      }
    }
  }
}
</script>
