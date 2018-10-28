<template>
  <div class="flex-extensible">
    <div class="main-content">
      <h4>Groups list</h4>

      <router-link
        v-for="group in groups"
        :key="group.key"
        :to="{ name: 'dashboard-group', params: { groupSlug: group.slug } }"
        class="label"
      >
        <template>{{ group.name }}</template>
      </router-link>

      <br>
      <router-link :to="{ name: 'dashboard-group-new' }" class="label">New group...</router-link>

      <hr>

      <router-view/>
    </div>
  </div>
</template>

<script>
const { mapGetters } = require('vuex')

module.exports = {
  name: 'dashboard-groups',

  computed: {
    ...mapGetters([
      'groups'
    ])
  }
}
</script>
