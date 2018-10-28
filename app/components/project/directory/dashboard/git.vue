<template>
  <div class="main-content">
    <h4>GIT... {{ projectSlug }} {{ directorySlug }}</h4>
  </div>
</template>

<script>
module.exports = {
  name: 'project-directory-dashboard-git',

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
