<template>
  <div>
    <h4>Settings... {{ projectSlug }} {{ directorySlug }}</h4>
  </div>
</template>

<script>
module.exports = {
  name: 'project-directory-dashboard-settings',

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
