<template>
  <RouterView />
</template>

<script>
export default {
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
