<template>
  <form class="not-so-large" @submit.prevent="submit">
    <label @click.prevent="projectSelection = true">Project</label>
    <button
      :class="{ disabled: !edition }"
      class="btn btn-link"
      @click.prevent="projectSelection = true"
    >
      <template>{{ project.name }}</template>
    </button>

    <modal :active.sync="projectSelection" title="Project selection">
      <common-project-list
        :selection="true"
        @selection="selectProject($event)"
      />
    </modal>

    <label :for="_uid + '-form-directory-name'">Directory name</label>
    <input
      :id="_uid + '-form-directory-name'"
      v-model="directoryName"
      :disabled="!edition"
      type="text"
      placeholder="Project name"
    >

    <label @click.prevent="showDialogDirectory">Directory path</label>
    <button
      :class="{ disabled: !edition }"
      class="btn btn-link"
      @click.prevent="showDialogDirectory"
    >
      <template>{{ directoryPath }}</template>
    </button>

    <label @click.prevent="showDialogDirectory">GIT integration</label>
    <button
      :class="{ disabled: !edition }"
      class="btn btn-link"
      @click.prevent="directoryGit = !directoryGit"
    >
      <template>{{ directoryGit ? 'Enabled' : 'Disabled' }}</template>
    </button>

    <footer v-show="edition">
      <button
        type="button"
        class="btn btn-link"
        @click.prevent="close"
      >
        <template>Cancel</template>
      </button>
      <button type="submit" class="btn">Save</button>
    </footer>
  </form>
</template>

<script>
const { mapGetters, mapActions } = require('vuex')
const { dialog } = window.nodeRequire('electron').remote
const Modal = require('../modal.vue')
const CommonProjectList = require('../project/list.vue')

module.exports = {
  name: 'common-directory-form',

  props: {
    projectSlug: {
      type: String,
      required: true
    },
    directorySlug: {
      type: String,
      required: true
    },
    edition: {
      type: Boolean,
      default: true
    }
  },

  components: {
    Modal,
    CommonProjectList
  },

  data () {
    return {
      directoryProjectSlug: null,
      projectSelection: false,
      directoryName: '',
      directoryPath: '',
      directoryGit: true
    }
  },

  computed: {
    ...mapGetters([
      'getProject',
      'getDirectory'
    ]),
    project () {
      return this.getProject(this.directoryProjectSlug || this.projectSlug)
    },
    directory () {
      return this.getDirectory(this.directorySlug)
    }
  },

  watch: {
    directory: {
      handler: 'reset',
      immediate: true
    },
    projectSlug: {
      handler: 'reset',
      immediate: true
    }
  },

  methods: {
    ...mapActions([
      'directoryUpdate'
    ]),
    reset () {
      if (this.directory) {
        this.directoryName = this.directory.name
        this.directoryPath = this.directory.path
        this.directoryGit = this.directory.git
      }
      this.directoryProjectSlug = this.projectSlug
    },
    submit () {
      this.directoryUpdate({
        directorySlug: this.directorySlug,
        projectSlug: this.directoryProjectSlug || this.projectSlug,
        name: this.directoryName,
        path: this.directoryPath,
        git: this.directoryGit
      })

      this.close(true)
    },
    selectProject (projectSlug) {
      this.projectSelection = false
      this.directoryProjectSlug = projectSlug || null
    },
    showDialogDirectory () {
      dialog.showOpenDialog(
        {
          defaultPath: this.directoryPath || undefined,
          buttonLabel: 'Update',
          properties: ['openDirectory']
        },
        paths => {
          if (paths && paths.length) {
            this.directoryPath = paths[0]
          }
        }
      )
    },
    close (status = false) {
      this.$emit('close', status)
      this.reset()
    }
  }
}
</script>
