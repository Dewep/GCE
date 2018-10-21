<template>
  <div>
    <h4>Commands... {{ projectSlug }} {{ directorySlug }}</h4>
  </div>
</template>

<script>
module.exports = {
  name: 'project-directory-dashboard-commands',

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
