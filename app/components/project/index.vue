<template>
  <router-view/>
</template>

<script>
module.exports = {
  name: 'project',

  props: {
    projectSlug: {
      type: String,
      required: true
    }
  }
}
</script>
