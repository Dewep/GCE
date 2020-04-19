<template>
  <div>
    <h1>Project Index {{ projectSlug }}</h1>
    <RouterView />
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
