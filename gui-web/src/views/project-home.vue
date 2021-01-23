<template>
  <div>
    <h1>{{ projectName }}</h1>
    <p>TODO: list of directories, with possibility to git clone them</p>
  </div>
</template>

<script>
// import { watchEffect, ref, toRef } from 'vue'
import { watchEffect, ref } from 'vue'
import configStore from '../store/config'

export default {
  name: 'ProjectHome',

  props: {
    projectSlug: {
      type: String,
      required: true
    }
  },

  setup (props) {
    const projectName = ref(null)

    watchEffect(() => {
      const project = configStore.getProject(props.projectSlug)
      projectName.value = (project && project.name) || props.projectSlug
    })

    return {
      // projectSlug: toRef(props, 'projectSlug'),
      projectName
    }
  }
}
</script>
