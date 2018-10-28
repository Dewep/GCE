<template>
  <div class="flex-column">
    <div class="flex-fixed topbar">
      <h1>Dashboard<small>{{ GCEVersion }}</small></h1>
      <nav>
        <router-link :to="{ name: 'dashboard-home' }" exact>Commands</router-link>
        <router-link :to="{ name: 'dashboard-group-new' }">Groups</router-link>
        <router-link :to="{ name: 'dashboard-settings' }">Settings</router-link>
      </nav>
    </div>

    <router-view/>
  </div>
</template>

<script>
const { mapGetters } = require('vuex')

module.exports = {
  name: 'dashboard',

  computed: {
    ...mapGetters([
      'GCEVersion'
    ])
  }
}
</script>
