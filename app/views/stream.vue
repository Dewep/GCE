<template>
  <div v-if="stream">
    <div
      v-for="line in stream.output"
      :key="line.date"
    >
      {{ line.date }} {{ line.type }}
      <pre>{{ line.content }}</pre>
    </div>
  </div>
</template>

<script>
import configStore from '../store/config'
import { ref, watchEffect } from 'vue'

export default {
  name: 'Stream',

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
    const stream = ref(null)

    watchEffect(() => {
      const def = configStore.getCommandStream(props.projectSlug, props.directorySlug, props.streamSlug)
      stream.value = def
    })

    return {
      projectSlug: props.projectSlug,
      directorySlug: props.directorySlug,
      streamSlug: props.streamSlug,
      stream
    }
  }
}
</script>
