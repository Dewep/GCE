<template>
  <div>
    <h1>{{ directoryName }}</h1>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue'
import configStore from '../store/config'

export default {
  name: 'DirectoryHome',

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
    const directoryName = ref(null)

    watchEffect(() => {
      const def = configStore.getDirectory(props.projectSlug, props.directorySlug)
      directoryName.value = (def && def.directory && def.directory.name) || props.directorySlug
    })

    return {
      directoryName
    }
  }
}
</script>
