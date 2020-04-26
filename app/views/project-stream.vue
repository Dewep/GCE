<template>
  <div>
    <h1>Project Stream {{ projectSlug }} {{ streamSlug }}</h1>
    <RouterView />
  </div>
</template>

<script>
import { toRefs } from 'vue'

export default {
  name: 'ProjectStream',

  props: {
    projectSlug: {
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
      ...toRefs(props)
    }
  }
}
</script>
