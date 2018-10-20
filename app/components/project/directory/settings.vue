<template>
  <div>
    <h1>Project {{ projectSlug }}</h1>
    <h2>Directory {{ directorySlug }}</h2>
  </div>
</template>

<script>
module.exports = {
  name: 'project-directory-settings',

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
