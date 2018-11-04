<template>
  <div class="flex-extensible">
    <div class="main-content">
      <h4>Home</h4>

      <button class="btn" @click="resetData()">Reset data</button>
      <button class="btn" @click="resetExampleData()">Reset example data</button>

      <h4>Projects</h4>
      <common-project-list />
    </div>
  </div>
</template>

<script>
const { mapActions } = require('vuex')
const CommonProjectList = require('../common/project/list.vue')

module.exports = {
  name: 'dashboard-home',

  components: {
    CommonProjectList
  },

  methods: {
    ...mapActions([
      'resetData',
      'resetExampleData'
    ])
  }
}
</script>
