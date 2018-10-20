<template>
  <div>
    <h1>Project {{ projectSlug }}</h1>
  </div>
</template>

<script>
module.exports = {
  name: 'project-settings',

  props: {
    projectSlug: {
      type: String,
      required: true
    }
  }
}
</script>
