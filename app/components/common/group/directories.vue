<template>
  <common-directory-list
    :edition="edition"
    :selection="selection"
    @close="close"
  />
</template>

<script>
const { mapGetters, mapActions } = require('vuex')
const CommonDirectoryList = require('../directory/list.vue')

module.exports = {
  name: 'common-group-directories',

  props: {
    groupSlug: {
      type: String,
      required: true
    },
    edition: {
      type: Boolean,
      default: true
    }
  },

  components: {
    CommonDirectoryList
  },

  computed: {
    ...mapGetters([
      'directories',
      'getDirectory'
    ]),

    selection () {
      return this.directories
        .filter(directory => directory.groups && directory.groups.includes(this.groupSlug))
        .map(directory => directory.slug)
    }
  },

  methods: {
    ...mapActions([
      'directoryUpdate'
    ]),

    close (newDirectories) {
      if (newDirectories && Array.isArray(newDirectories)) {
        // Remove the group to old directories
        for (const directorySlug of this.selection) {
          if (!newDirectories.includes(directorySlug)) {
            const directory = this.getDirectory(directorySlug)
            const groups = (directory.groups || []).filter(groupSlug => groupSlug !== this.groupSlug)
            this.directoryUpdate({ directorySlug, groups })
          }
        }

        // Add the group to new directories
        for (const directorySlug of newDirectories) {
          if (!this.selection.includes(directorySlug)) {
            const directory = this.getDirectory(directorySlug)
            const groups = [...(directory.groups || []), this.groupSlug]
            this.directoryUpdate({ directorySlug, groups })
          }
        }
      }

      this.$emit('close')
    }
  }
}
</script>
