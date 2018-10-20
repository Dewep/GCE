<template>
  <div>
    <h1>Project {{ projectSlug }}</h1>
    <h2>Directory {{ directorySlug }}</h2>
    <h2>Command {{ commandSlug }}</h2>
  </div>
</template>

<script>
module.exports = {
  name: 'project-directory-command',

  props: {
    projectSlug: {
      type: String,
      required: true
    },
    directorySlug: {
      type: String,
      required: true
    },
    commandSlug: {
      type: String,
      required: true
    }
  }
}
</script>
