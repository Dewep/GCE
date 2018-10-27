<template>
  <div>
    <p>Form for group slug={{ groupSlug || '(new)' }}</p>
  </div>
</template>

<script>
// const { mapGetters } = require('vuex')

module.exports = {
  name: 'dashboard-group-form',

  props: {
    groupSlug: {
      type: String,
      default: null
    }
  },

  data () {
    return {
    }
  }
}
</script>
