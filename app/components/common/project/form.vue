<template>
  <form class="not-so-large" @submit.prevent="submit">
    <label :for="_uid + '-form-project-name'">Project name</label>
    <input
      :id="_uid + '-form-project-name'"
      v-model="projectName"
      :disabled="!edition"
      type="text"
      placeholder="Project name"
    >

    <template v-if="projectUrl || edition">
      <label :for="_uid + '-form-project-url'">Auto-definition URL</label>
      <input
        :id="_uid + '-form-project-url'"
        v-model="projectUrl"
        :disabled="!edition"
        type="text"
        placeholder="N/A"
      >
    </template>

    <template v-if="projectUrl">
      <label @click.prevent="showDialogDirectory">Root directory path</label>
      <button
        :disabled="!edition"
        class="btn btn-link"
        @click.prevent="showDialogDirectory"
      >
        <template>{{ projectPath || 'N/A' }}</template>
      </button>
      <blockquote v-show="edition">This rootpath will be used to clone the directories described in the auto-definition URL.</blockquote>
    </template>

    <footer v-show="edition">
      <button
        type="button"
        class="btn btn-link"
        @click.prevent="close"
      >
        <template>Cancel</template>
      </button>
      <button
        :disabled="!!(!projectPath && projectUrl)"
        type="submit"
        class="btn"
      >
        <template>{{ projectSlug ? 'Save' : 'Create' }}</template>
      </button>
    </footer>
  </form>
</template>

<script>
const { mapGetters, mapActions } = require('vuex')
const { dialog } = window.nodeRequire('electron').remote

module.exports = {
  name: 'common-project-form',

  props: {
    projectSlug: {
      type: String,
      default: null
    },
    edition: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      projectName: '',
      projectUrl: '',
      projectPath: ''
    }
  },

  computed: {
    ...mapGetters([
      'getProject'
    ]),
    project () {
      return this.getProject(this.projectSlug)
    }
  },

  watch: {
    project: {
      handler: 'reset',
      immediate: true
    }
  },

  methods: {
    ...mapActions([
      'projectCreate',
      'projectUpdate'
    ]),

    reset () {
      if (this.project) {
        this.projectName = this.project.name
        this.projectUrl = this.project.url
        this.projectPath = this.project.path
      }
    },

    showDialogDirectory () {
      dialog.showOpenDialog(
        {
          defaultPath: this.projectPath || undefined,
          buttonLabel: 'Update',
          properties: ['openDirectory']
        },
        paths => {
          if (paths && paths.length) {
            this.projectPath = paths[0]
          }
        }
      )
    },

    async submit () {
      let ret

      if (this.projectSlug) {
        ret = await this.projectUpdate({ projectSlug: this.projectSlug, name: this.projectName, url: this.projectUrl, path: this.projectPath })
      } else {
        ret = await this.projectCreate({ name: this.projectName, url: this.projectUrl, path: this.projectPath })
      }

      this.close(ret || null)
    },

    close (status = null) {
      this.reset()
      this.$emit('close', status)
    }
  }
}
</script>
