<template>
  <div>
    <h4>Group "{{ group.name }}"</h4>
  </div>
</template>

<script>
const { mapGetters } = require('vuex')

module.exports = {
  name: 'dashboard-group',

  props: {
    groupSlug: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'getGroup'
    ]),
    group () {
      return this.getGroup(this.groupSlug)
    }
  },

  watch: {
    group: {
      handler () {
        if (!this.group) {
          this.$router.push({ name: 'dashboard-group-new' })
        }
      },
      immediate: true
    }
  }
}
</script>
