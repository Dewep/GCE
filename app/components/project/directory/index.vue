<template>
  <router-view/>
</template>

<script>
module.exports = {
  name: 'project-directory',

  props: {
    projectSlug: {
      type: String,
      required: true
    },
    directorySlug: {
      type: String,
      required: true
    }
  }
}
</script>
