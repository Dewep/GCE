<template>
  <form class="not-so-large" @submit.prevent="submit">
    <p v-show="!edition && !selection.length"><i><small>There is no directory that uses this group.</small></i></p>

    <div :class="{ 'links-checkbox': edition }" class="links-list">
      <div
        v-for="directory in aggregatedDirectories"
        v-show="edition || directory.selected"
        :key="directory.slug"
        class="flex-row"
      >
        <router-link
          :to="{ name: 'directory', params: { projectSlug: directory.projectSlug, directorySlug: directory.slug } }"
          :class="{ active: edition && directory.selected }"
          :event="edition ? '' : 'click'"
          class="flex-extensible-fixed"
          @click.native="toggleSelection($event, directory)"
        >
          <template>{{ directory.projectName }} / {{ directory.name }}</template>
        </router-link>
      </div>
    </div>

    <footer v-show="edition">
      <button
        type="button"
        class="btn btn-link"
        @click.prevent="close()"
      >
        <template>Cancel</template>
      </button>
      <button type="submit" class="btn">Save</button>
    </footer>
  </form>
</template>

<script>
const { mapGetters } = require('vuex')

module.exports = {
  name: 'common-directory-list',

  props: {
    edition: {
      type: Boolean,
      default: true
    },
    selection: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      updatedSelection: []
    }
  },

  computed: {
    ...mapGetters([
      'projects',
      'getDirectory'
    ]),

    directoriesWithProject () {
      const directories = []

      for (const project of this.projects) {
        for (const directorySlug of project.directories) {
          const directory = this.getDirectory(directorySlug)

          if (directory) {
            directories.push({
              ...directory,
              projectSlug: project.slug,
              projectName: project.name
            })
          }
        }
      }

      return directories
    },

    aggregatedDirectories () {
      return this.directoriesWithProject.map(directory => ({
        ...directory,
        selected: this.updatedSelection.includes(directory.slug)
      }))
    }
  },

  watch: {
    selection: {
      handler () {
        this.updatedSelection = [...this.selection]
      },
      immediate: true
    }
  },

  methods: {
    toggleSelection (event, directory) {
      if (directory.selected) {
        this.updatedSelection = this.updatedSelection.filter(directorySlug => directorySlug !== directory.slug)
      } else {
        this.updatedSelection.push(directory.slug)
      }
    },
    submit () {
      this.close(this.updatedSelection)
    },
    close (ret = null) {
      this.$emit('close', ret)
      this.updatedSelection = [...this.selection]
    }
  }
}
</script>
