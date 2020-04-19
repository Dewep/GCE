<template>
  <div>
    <h1>Directory Stream {{ projectSlug }}/{{ directorySlug }}/{{ streamSlug }}</h1>
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
    },
    streamSlug: {
      type: String,
      required: true
    }
  },

  setup (props) {
    return {
      projectSlug: props.projectSlug,
      directorySlug: props.directorySlug,
      streamSlug: props.streamSlug
    }
  }
}
</script>
