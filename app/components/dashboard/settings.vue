<template>
  <div class="flex-extensible">
    <div class="main-content">
      <h4>Settings</h4>
      <p>You have nothing to configure.</p>

      <h4>Reset</h4>
      <button class="btn" @click="resetData()">Reset data</button>
      <button class="btn" @click="resetExampleData()">Reset example data</button>
    </div>
  </div>
</template>

<script>
const { mapActions } = require('vuex')

module.exports = {
  name: 'dashboard-settings',

  methods: {
    ...mapActions([
      'resetData',
      'resetExampleData'
    ])
  }
}
</script>
