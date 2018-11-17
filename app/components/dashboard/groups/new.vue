<template>
  <div class="main-content">
    <h4>Groups list</h4>

    <div class="links-list not-so-large">
      <div
        v-for="group in groups"
        :key="group.slug"
        class="flex-row"
      >
        <router-link
          :to="{ name: 'dashboard-group', params: { groupSlug: group.slug } }"
          class="flex-extensible-fixed"
        >
          <template>{{ group.name }}</template>
        </router-link>
      </div>
    </div>

    <h4>New group</h4>

    <common-group-form
      @close="redirectToGroup"
    />
  </div>
</template>

<script>
const { mapGetters } = require('vuex')
const CommonGroupForm = require('./form.vue')

module.exports = {
  name: 'dashboard-groups-new',

  components: {
    CommonGroupForm
  },

  computed: {
    ...mapGetters([
      'groups'
    ])
  },

  methods: {
    redirectToGroup (groupSlug) {
      console.log('redirectToGroup', groupSlug)
      this.$router.push({ name: 'dashboard-group', params: { groupSlug } })
    }
  }
}
</script>
