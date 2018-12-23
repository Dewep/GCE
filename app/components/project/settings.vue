<template>
  <div class="flex-column">
    <div class="flex-fixed topbar">
      <h1>{{ project.name }}</h1>
    </div>
    <div class="flex-extensible">
      <div class="main-content">
        <h4>Directories</h4>
        <div class="links-list not-so-large">
          <div
            v-for="(directory, $index) in directories"
            :key="directory.slug"
            class="flex-row"
          >
            <router-link
              :to="{ name: 'directory', params: { projectSlug: project.slug, directorySlug: directory.slug } }"
              class="flex-extensible-fixed"
            >
              <template>{{ directory.name }}</template>
            </router-link>
            <a
              :class="{ disabled: $index === 0 }"
              class="flex-fixed code"
              @click.prevent="directoryPositionUp({ projectSlug: project.slug, directorySlug: directory.slug })"
            >
              <template>▲</template>
            </a>
            <a
              :class="{ disabled: $index === directories.length - 1 }"
              class="flex-fixed code"
              @click.prevent="directoryPositionDown({ projectSlug: project.slug, directorySlug: directory.slug })"
            >
              <template>▼</template>
            </a>
          </div>

          <div class="flex-row">
            <a class="flex-extensible-fixed mt-10 p-8" @click="showDialogDirectories">Add new directories</a>
          </div>
        </div>

        <h4>
          <button v-show="!form" class="btn" @click="form = 'update'">Update</button>
          <button v-show="!form" class="btn btn-error" @click="form = 'delete'">Remove</button>
          <template>Project properties</template>
        </h4>
        <form v-if="form === 'delete'" class="not-so-large" @submit.prevent="removeProject">
          <p>All the directories and their commands will be removed. Move the directories to another project if you want to keep them.</p>
          <footer>
            <button class="btn btn-link" @click.prevent="form = null">Cancel</button>
            <button class="btn btn-error" type="submit">Remove</button>
          </footer>
        </form>
        <common-project-form
          v-else
          :project-slug="projectSlug"
          :edition="form === 'update'"
          @close="form = null"
        />
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
      form: null
    }
  },

  computed: {
    ...mapGetters([
      'getProject',
      'getDirectory'
    ]),
    project () {
      return this.getProject(this.projectSlug)
    },
    directories () {
      return this.project.directories.map(this.getDirectory)
    }
  },

  methods: {
    ...mapActions([
      'projectRemove',
      'directoryPositionUp',
      'directoryPositionDown'
    ]),
    async removeProject () {
      await this.projectRemove({ projectSlug: this.projectSlug })
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
