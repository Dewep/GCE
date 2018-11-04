<template>
  <div class="main-content">
    <h4>
      <button v-show="!form" class="btn" @click="form = 'update'">Update</button>
      <button v-show="!form" class="btn btn-error" @click="form = 'delete'">Remove</button>
      <template>Directory properties</template>
    </h4>
    <template v-if="form === 'delete'">
      <form class="not-so-large" @submit.prevent="removeProject">
        <p>All the commands linked to this directory will be removed.</p>
        <footer>
          <button class="btn btn-link" @click.prevent="form = null">Cancel</button>
          <button class="btn btn-error" type="submit">Remove</button>
        </footer>
      </form>
    </template>
    <common-directory-form
      v-else
      :project-slug="projectSlug"
      :directory-slug="directorySlug"
      :edition="form === 'update'"
      @close="form = null"
    />

    <h4>
      <button v-show="!updateGroups" class="btn" @click="updateGroups = true">Update</button>
      <template>Groups</template>
    </h4>
    <p v-if="!updateGroups && !directory.groups.length"><i>No group linked to this directory.</i></p>
    <common-directory-groups
      v-else
      :project-slug="projectSlug"
      :directory-slug="directorySlug"
      :edition="updateGroups"
      @close="updateGroups = false"
    />
  </div>
</template>

<script>
const { mapGetters, mapActions } = require('vuex')
const CommonDirectoryForm = require('../../../common/directory/form.vue')
const CommonDirectoryGroups = require('../../../common/directory/groups.vue')

module.exports = {
  name: 'project-directory-dashboard-settings',

  props: {
    projectSlug: {
      type: String,
      required: true
    },
    directorySlug: {
      type: String,
      required: true
    }
  },

  components: {
    CommonDirectoryForm,
    CommonDirectoryGroups
  },

  data () {
    return {
      form: null,
      updateGroups: false
    }
  },

  computed: {
    ...mapGetters([
      'getDirectory',
      'groups'
    ]),
    directory () {
      return this.getDirectory(this.directorySlug)
    }
  },

  methods: {
    ...mapActions([
      'directoryDelete'
    ]),
    removeDirectory () {
      this.directoryDelete({ projectSlug: this.projectSlug, directorySlug: this.directorySlug })
    }
  }
}
</script>
