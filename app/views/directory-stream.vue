<template>
  <div>
    <Stream
      :project-slug="projectSlug"
      :directory-slug="directorySlug"
      :stream-slug="streamSlug"
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
