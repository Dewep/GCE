<template>
  <div>
    <h1>Directory Home {{ projectSlug }}/{{ directorySlug }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    projectSlug: {
      type: String,
      required: true
    },
    directorySlug: {
      type: String,
      required: true
    }
  },

  setup (props) {
    return {
      projectSlug: props.projectSlug,
      directorySlug: props.directorySlug
    }
  }
}
</script>
