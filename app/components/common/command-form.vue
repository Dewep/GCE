<template>
  <div>
    <p>Form for command slug={{ commandSlug || '(new)' }}</p>
  </div>
</template>

<script>
// const { mapGetters } = require('vuex')

module.exports = {
  name: 'common-command-form',

  props: {
    commandSlug: {
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
