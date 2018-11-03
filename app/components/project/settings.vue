<template>
  <div class="flex-column">
    <div class="flex-fixed topbar">
      <h1>{{ project.name }}</h1>
    </div>
    <div class="flex-extensible">
      <div class="main-content">
        <h4>Directories</h4>
        <p>Project settings...</p>
        <button class="btn" @click="showDialogDirectories">Add new directories...</button>
        <input type="file" webkitdirectory multiple>

        <h4>
          <button v-show="!form" class="btn" @click="form = 'update'">Update</button>
          <button v-show="!form" class="btn btn-error" @click="form = 'delete'">Remove</button>
          <template>Project update</template>
        </h4>
        <common-project-form
          v-if="form === 'update'"
          :project-slug="projectSlug"
          @close="form = null"
        />
        <template v-else-if="form === 'delete'">
          <form class="not-so-large" @submit.prevent="removeProject">
            <p>All the directories and their commands will be removed. Move the directories to another project if you want to keep them.</p>
            <footer>
              <button class="btn btn-link" @click.prevent="form = null">Cancel</button>
              <button class="btn btn-error" type="submit">Remove</button>
            </footer>
          </form>
        </template>
        <p v-else>Project name: "{{ project.name }}"</p>
      </div>
    </div>
  </div>
</template>

<script>
const { mapGetters, mapActions } = require('vuex')
const { dialog } = window.nodeRequire('electron').remote
const CommonProjectForm = require('../common/project/form.vue')

module.exports = {
  name: 'project-settings',

  props: {
    projectSlug: {
      type: String,
      required: true
    }
  },

  components: {
    CommonProjectForm
  },

  data () {
    return {
      form: false
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

  methods: {
    ...mapActions([
      'projectDelete'
    ]),
    removeProject () {
      this.projectDelete({ projectSlug: this.projectSlug })
    },
    showDialogDirectories () {
      const path = dialog.showOpenDialog({
        properties: ['openDirectory', 'multiSelections']
      })
      console.log({ path })
    }
  }
}
</script>
