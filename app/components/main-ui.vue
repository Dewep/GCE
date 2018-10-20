<template>
  <div class="flex-row h-100">
    <sidebar class="flex-fixed"/>
    <router-view class="flex-extensible-fixed"/>
  </div>
</template>

<script>
const Sidebar = require('./sidebar.vue')

module.exports = {
  name: 'main-ui',

  components: { Sidebar }
}
</script>
