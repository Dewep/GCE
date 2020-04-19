<template>
  <div>
    <RouterLink
      :to="{ name: 'dashboard' }"
      class="dashboard"
      exact
    >
      Dashboard
    </RouterLink>

    <div
      v-for="(project, projectSlug) in projects"
      :key="projectSlug"
    >
      <RouterLink
        :to="{ name: 'project', params: { projectSlug } }"
        exact
      >
        {{ project.name || projectSlug }}
      </RouterLink>
    </div>
  </div>
</template>

<script>
import configStore from '../store/config'

export default {
  setup () {
    return {
      projects: configStore.projects
    }
  }
}
</script>

<style scoped>
/* .dashboard {} */
</style>
