<template>
  <div class="flex-column">
    <div class="flex-fixed topbar">
      <h1>{{ project.name }}</h1>
    </div>
    <div class="flex-extensible">
      <div class="main-content">
        <p>Project settings...</p>
      </div>
    </div>
  </div>
</template>

<script>
const { mapGetters } = require('vuex')

module.exports = {
  name: 'project-settings',

  props: {
    projectSlug: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'getProject'
    ]),
    project () {
      return this.getProject(this.projectSlug)
    }
  }
}
</script>
