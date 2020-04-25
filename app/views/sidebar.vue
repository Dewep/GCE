<template>
  <div>
    <div
      v-for="(project, projectSlug) in projects"
      :key="projectSlug"
      class="project"
    >
      <RouterLink
        :to="{ name: 'project', params: { projectSlug } }"
        exact
      >
        {{ project.name || projectSlug }}
      </RouterLink>

      <div
        v-for="(directory, directorySlug) in project.directories"
        :key="projectSlug + '/' + directorySlug"
        class="directory"
      >
        <RouterLink
          :to="{ name: 'directory', params: { projectSlug, directorySlug } }"
          exact
        >
          {{ directory.name || directorySlug }}
        </RouterLink>
      </div>
    </div>

    <RouterLink
      :to="{ name: 'dashboard' }"
      class="dashboard"
      exact
    >
      GCE <sup>3.0.0</sup>
    </RouterLink>
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
#sidebar {
  width: 20rem;
  background: #282b2d;
  box-shadow: #282b2d 0 0 .5rem;
}

a, a:link, a:visited {
  text-decoration: none;
  display: block;
  padding: .3rem 1rem;
}

a:hover, a:active, a:focus, a.router-link-active {
  background: #1d1f21;
}

.project {
  margin-top: 1rem;
}
.project > a {
  font-size: 1.1rem;
  font-weight: bold;
  padding: .5rem 1rem;
}

.directory > a {
  padding-left: 1.5rem;
}

a.dashboard {
  text-align: center;
  font-size: 1.2rem;
  padding: .5rem 1rem 2rem;
  font-weight: bold;
  margin-top: 1rem;
}
</style>
