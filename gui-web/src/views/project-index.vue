<template>
  <RouterView />
</template>

<script>
export default {
  name: 'ProjectIndex',

  props: {
    projectSlug: {
      type: String,
      required: true
    }
  },

  setup () {
  }
}
</script>
