<template>
  <div>
    <h1>Project Home {{ projectSlug }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    projectSlug: {
      type: String,
      required: true
    }
  },

  setup (props) {
    return {
      projectSlug: props.projectSlug
    }
  }
}
</script>
