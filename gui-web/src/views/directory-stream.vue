<template>
  <div>
    <Stream
      :stream-slug="streamSlug"
      :project-slug="projectSlug"
      :directory-slug="directorySlug"
    />
  </div>
</template>

<script>
import Stream from './stream.vue'
import { toRefs } from 'vue'

export default {
  name: 'DirectoryStream',

  components: {
    Stream
  },

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
      ...toRefs(props)
    }
  }
}
</script>
