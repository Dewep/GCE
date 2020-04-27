<template>
  <div>
    <RouterLink
      v-if="warnings.length"
      :to="{ name: 'dashboard' }"
      class="warnings"
      exact
    >
      {{ warnings.length }} config warning{{ warnings.length > 1 ? 's' : '' }}
    </RouterLink>

    <div
      v-for="project in projects"
      :key="'Sidebar/p/' + project.slug"
      class="project"
    >
      <RouterLink
        :to="{ name: 'project', params: { projectSlug: project.slug } }"
        exact
      >
        {{ project.name }}
      </RouterLink>

      <div
        v-for="stream in project.streams"
        :key="'Sidebar/p/' + project.slug + '/s/' + stream.slug"
        class="stream"
      >
        <RouterLink
          :to="{ name: 'project-stream', params: { projectSlug: project.slug, streamSlug: stream.slug } }"
          exact
        >
          {{ stream.name }}
        </RouterLink>
      </div>

      <div
        v-for="directory in project.directories"
        :key="'Sidebar/p/' + project.slug + '/d/' + directory.slug"
        class="directory"
      >
        <RouterLink
          :to="{ name: 'directory', params: { projectSlug: project.slug, directorySlug: directory.slug } }"
          exact
        >
          {{ directory.name }}
        </RouterLink>

        <div
          v-for="stream in directory.streams"
          :key="'Sidebar/p/' + project.slug + '/d/' + directory.slug + '/s/' + stream.slug"
          class="stream"
        >
          <RouterLink
            :to="{ name: 'directory-stream', params: { projectSlug: project.slug, directorySlug: directory.slug, streamSlug: stream.slug } }"
            exact
          >
            {{ stream.name }}
          </RouterLink>
        </div>
      </div>
    </div>

    <RouterLink
      :to="{ name: 'dashboard' }"
      class="dashboard"
      exact
    >
      GCE <sup>{{ gceVersion }}</sup>
    </RouterLink>
  </div>
</template>

<script>
import configStore from '../store/config'
import { ref, watchEffect } from 'vue'

export default {
  name: 'Sidebar',

  setup () {
    const projects = ref([])

    watchEffect(() => {
      projects.value = []

      for (const projectSlug of Object.keys(configStore.projects.value)) {
        const project = configStore.projects.value[projectSlug]
        const directories = []

        for (const directorySlug of Object.keys(project.directories)) {
          const directory = project.directories[directorySlug]

          directories.push({
            slug: directorySlug,
            name: directory.name || directorySlug,
            streams: configStore.getCommandStreams(projectSlug, directorySlug)
          })
        }

        projects.value.push({
          slug: projectSlug,
          name: project.name || projectSlug,
          directories,
          streams: configStore.getCommandStreams(projectSlug, null)
        })
      }
    })

    return {
      gceVersion: window.gceVersion,
      projects,
      warnings: configStore.warnings
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

.stream > a {
  padding-left: 2.5rem;
  font-size: .8rem;
  background: #24233e;
}

a.dashboard {
  text-align: center;
  font-size: 1.2rem;
  padding: .5rem 1rem 2rem;
  font-weight: bold;
  margin-top: 1rem;
}

a.warnings {
  padding: 1rem .5rem;
  font-weight: bold;
  background: #3e2222;
  text-align: center;
  text-transform: uppercase;
}
</style>
