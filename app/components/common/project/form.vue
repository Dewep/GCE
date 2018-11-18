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

    <footer v-show="edition">
      <button
        type="button"
        class="btn btn-link"
        @click.prevent="close"
      >
        <template>Cancel</template>
      </button>
      <button type="submit" class="btn">{{ projectSlug ? 'Save' : 'Create' }}</button>
    </footer>
  </form>
</template>

<script>
const { mapGetters, mapActions } = require('vuex')

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
      projectName: ''
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
      }
    },
    async submit () {
      let ret

      if (this.projectSlug) {
        ret = await this.projectUpdate({ projectSlug: this.projectSlug, name: this.projectName })
      } else {
        ret = await this.projectCreate({ name: this.projectName })
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
