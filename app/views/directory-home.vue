<template>
  <div>
    <Stream
      v-if="streamSlug"
      :project-slug="projectSlug"
      :directory-slug="directorySlug"
      :stream-slug="streamSlug"
    />
    <div
      v-else
      class="home"
    >
      <h1>{{ directoryName }}</h1>
      <button @click.prevent="runCommand()">
        {{ directoryArgsName }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect, toRefs } from 'vue'
import Stream from './stream.vue'
import configStore from '../store/config'
import wsStore from '../store/ws'

export default {
  name: 'DirectoryHome',

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
    }
  },

  setup (props) {
    const directory = ref(null)
    const directoryName = ref(null)
    const directoryArgs = ref([])
    const directoryArgsName = ref('')
    const streamSlug = ref(null)

    watchEffect(() => {
      const def = configStore.getDirectory(props.projectSlug, props.directorySlug)
      directory.value =  (def && def.directory) || null
      directoryName.value = (directory.value && directory.value.name) || props.directorySlug
      directoryArgs.value = (directory.value && directory.value.args) || ['N/A']
      directoryArgsName.value = directoryArgs.value.join(' ')
    })

    watchEffect(() => {
      streamSlug.value = configStore.getDirectoryStreamPrimary(props.projectSlug, props.directorySlug)
    })

    function runCommand () {
      if (directory.value && directory.value.args && directory.value.args.length) {
        wsStore.newCommandStream(props.projectSlug, props.directorySlug, true, directory.value.args, directory.value.env, directory.value.notifications, directory.value.name)
      }
    }

    return {
      ...toRefs(props),
      directoryName,
      directoryArgs,
      directoryArgsName,
      streamSlug,
      runCommand
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 30vh;
}

.home button {
  font-size: 120%;
  margin-top: 1rem;
}
</style>
