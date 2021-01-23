<template>
  <div>
    <Stream
      :stream-slug="streamSlug"
      :project-slug="projectSlug"
    />
  </div>
</template>

<script>
import Stream from './stream.vue'
import { toRefs } from 'vue'

export default {
  name: 'ProjectStream',

  components: {
    Stream
  },

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
