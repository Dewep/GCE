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
      v-for="stream in globalStreams"
      :key="'Sidebar/s/' + stream.slug"
      :class="[stream.status]"
      class="streamer"
    >
      <RouterLink
        :to="{ name: 'stream', params: { streamSlug: stream.slug } }"
        class="streamer"
        exact
      >
        <span :key="'Sidebar/s/' + stream.slug + '/name'">{{ stream.name }}</span>
        <i
          :key="'Sidebar/s/' + stream.slug + '/unread'"
          v-show="stream.unread"
          class="stream-unread fa fa-dot-circle"
        />
        <a
          v-if="stream.status !== 'RUNNING'"
          :key="'Sidebar/s/' + stream.slug + '/close'"
          class="stream-action"
          @click.prevent.stop="streamUpdate(stream.slug, 'close')"
        >
          <i class="fa fa-trash" />
        </a>
        <a
          v-if="stream.status !== 'RUNNING'"
          :key="'Sidebar/s/' + stream.slug + '/start'"
          class="stream-action"
          @click.prevent.stop="streamUpdate(stream.slug, 'start')"
        >
          <i class="fa fa-play" />
        </a>
        <a
          v-if="stream.status === 'RUNNING'"
          :key="'Sidebar/s/' + stream.slug + '/stop'"
          class="stream-action"
          @click.prevent.stop="streamUpdate(stream.slug, 'stop')"
        >
          <i class="fa fa-stop" />
        </a>
        <a
          v-if="stream.status === 'RUNNING'"
          :key="'Sidebar/s/' + stream.slug + '/restart'"
          class="stream-action"
          @click.prevent.stop="streamUpdate(stream.slug, 'restart')"
        >
          <i class="fa fa-redo" />
        </a>
      </RouterLink>
    </div>

    <div
      v-for="project in projects"
      :key="'Sidebar/p/' + project.slug"
      class="project"
    >
      <RouterLink
        :to="{ name: 'project', params: { projectSlug: project.slug } }"
        exact
      >
        <span>{{ project.name }}</span>
      </RouterLink>

      <div
        v-for="stream in project.streams"
        :key="'Sidebar/p/' + project.slug + '/s/' + stream.slug"
        :class="[stream.status]"
        class="stream"
      >
        <RouterLink
          :to="{ name: 'project-stream', params: { projectSlug: project.slug, streamSlug: stream.slug } }"
          class="streamer"
          exact
        >
          <span :key="'Sidebar/s/' + stream.slug + '/unread'">{{ stream.name }}</span>
          <i
            :key="'Sidebar/s/' + stream.slug + '/unread'"
            v-show="stream.unread"
            class="stream-unread fa fa-dot-circle"
          />
          <a
            v-if="stream.status !== 'RUNNING'"
            :key="'Sidebar/s/' + stream.slug + '/close'"
            class="stream-action"
            @click.prevent.stop="streamUpdate(stream.slug, 'close')"
          >
            <i class="fa fa-trash" />
          </a>
          <a
            v-if="stream.status !== 'RUNNING'"
            :key="'Sidebar/s/' + stream.slug + '/start'"
            class="stream-action"
            @click.prevent.stop="streamUpdate(stream.slug, 'start')"
          >
            <i class="fa fa-play" />
          </a>
          <a
            v-if="stream.status === 'RUNNING'"
            :key="'Sidebar/s/' + stream.slug + '/stop'"
            class="stream-action"
            @click.prevent.stop="streamUpdate(stream.slug, 'stop')"
          >
            <i class="fa fa-stop" />
          </a>
          <a
            v-if="stream.status === 'RUNNING'"
            :key="'Sidebar/s/' + stream.slug + '/restart'"
            class="stream-action"
            @click.prevent.stop="streamUpdate(stream.slug, 'restart')"
          >
            <i class="fa fa-redo" />
          </a>
        </RouterLink>
      </div>

      <div
        v-for="directory in project.directories"
        :key="'Sidebar/p/' + project.slug + '/d/' + directory.slug"
        :class="directory.stream ? ['stream', directory.stream.status] : []"
        class="directory"
      >
        <RouterLink
          :to="{ name: 'directory', params: { projectSlug: project.slug, directorySlug: directory.slug } }"
          class="streamer"
          exact
        >
          <span :key="'Sidebar/p/' + project.slug + '/d/' + directory.slug + '/name'">{{ directory.name }}</span>
          <i
            v-show="directory.stream && directory.stream.unread"
            :key="'Sidebar/s/' + project.slug + '/d/' + directory.slug + '/unread'"
            class="stream-unread fa fa-dot-circle"
          />
          <a
            v-if="!directory.stream || directory.stream.status !== 'RUNNING'"
            :key="'Sidebar/p/' + project.slug + '/d/' + directory.slug + '/start'"
            class="stream-action"
            @click.prevent.stop="startDirectoryCommand(directory)"
          >
            <i class="fa fa-play" />
          </a>
          <a
            v-if="directory.stream && directory.stream.status === 'RUNNING'"
            :key="'Sidebar/s/' + project.slug + '/d/' + directory.slug + '/stop'"
            class="stream-action"
            @click.prevent.stop="streamUpdate(directory.stream.slug, 'stop')"
          >
            <i class="fa fa-stop" />
          </a>
          <a
            v-if="directory.stream && directory.stream.status === 'RUNNING'"
            :key="'Sidebar/s/' + project.slug + '/d/' + directory.slug + '/restart'"
            class="stream-action"
            @click.prevent.stop="streamUpdate(directory.stream.slug, 'restart')"
          >
            <i class="fa fa-redo" />
          </a>
        </RouterLink>

        <div
          v-for="stream in directory.streams"
          :key="'Sidebar/p/' + project.slug + '/d/' + directory.slug + '/s/' + stream.slug"
          :class="[stream.status]"
          class="stream"
        >
          <RouterLink
            :to="{ name: 'directory-stream', params: { projectSlug: project.slug, directorySlug: directory.slug, streamSlug: stream.slug } }"
            class="streamer"
            exact
          >
            <span :key="'Sidebar/s/' + stream.slug + '/name'">{{ stream.name }}</span>
            <i
              :key="'Sidebar/s/' + stream.slug + '/unread'"
              v-show="stream.unread"
              class="stream-unread fa fa-dot-circle"
            />
            <a
              v-if="stream.status !== 'RUNNING'"
              :key="'Sidebar/s/' + stream.slug + '/close'"
              class="stream-action"
              @click.prevent.stop="streamUpdate(stream.slug, 'close')"
            >
              <i class="fa fa-trash" />
            </a>
            <a
              v-if="stream.status !== 'RUNNING'"
              :key="'Sidebar/s/' + stream.slug + '/start'"
              class="stream-action"
              @click.prevent.stop="streamUpdate(stream.slug, 'start')"
            >
              <i class="fa fa-play" />
            </a>
            <a
              v-if="stream.status === 'RUNNING'"
              :key="'Sidebar/s/' + stream.slug + '/stop'"
              class="stream-action"
              @click.prevent.stop="streamUpdate(stream.slug, 'stop')"
            >
              <i class="fa fa-stop" />
            </a>
            <a
              v-if="stream.status === 'RUNNING'"
              :key="'Sidebar/s/' + stream.slug + '/restart'"
              class="stream-action"
              @click.prevent.stop="streamUpdate(stream.slug, 'restart')"
            >
              <i class="fa fa-redo" />
            </a>
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
import wsStore from '../store/ws'

export default {
  name: 'Sidebar',

  setup () {
    const allStreams = ref([])
    const globalStreams = ref([])
    const projects = ref([])

    watchEffect(() => {
      allStreams.value = configStore.getAllCommandStreams()
    })

    watchEffect(() => {
      globalStreams.value = []
      projects.value = []
      const usedStreams = []

      for (const projectSlug of Object.keys(configStore.projects.value)) {
        const project = configStore.projects.value[projectSlug]
        const directories = []

        for (const directorySlug of Object.keys(project.directories)) {
          const directory = project.directories[directorySlug]

          const item = {
            slug: directorySlug,
            projectSlug,
            name: directory.name || directorySlug,
            args: directory.args,
            stream: null,
            streams: []
          }

          for (const stream of allStreams.value) {
            if (stream.projectSlug === projectSlug && stream.directorySlug === directorySlug) {
              usedStreams.push(stream.slug)

              if (stream.primary) {
                item.stream = stream
              } else {
                item.streams.push(stream)
              }
            }
          }

          directories.push(item)
        }

        const item = {
          slug: projectSlug,
          name: project.name || projectSlug,
          directories,
          streams: []
        }

        for (const stream of allStreams.value) {
          if (stream.projectSlug === projectSlug && stream.directorySlug === null) {
            usedStreams.push(stream.slug)
            item.streams.push(stream)
          }
        }

        projects.value.push(item)
      }

      for (const stream of allStreams.value) {
        if (!usedStreams.includes(stream.slug)) {
          globalStreams.value.push(stream)
        }
      }
    })

    function streamUpdate (streamSlug, action) {
      wsStore.updateCommandStream(streamSlug, action)
    }

    function startDirectoryCommand (directory) {
      if (directory.stream) {
        return streamUpdate(directory.stream.slug, 'start')
      }
      wsStore.newCommandStream(directory.projectSlug, directory.slug, true, directory.args)
    }

    return {
      gceVersion: window.gceVersion,
      globalStreams,
      projects,
      warnings: configStore.warnings,
      startDirectoryCommand,
      streamUpdate
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
  opacity: .9;
}

a:hover, a:active, a:focus, a.router-link-active {
  opacity: 1;
}
a.router-link-active {
  background: #242729;
  border-left: .5rem solid #969896;
  /* #1d1f21; */
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

.stream-unread, .stream-action {
  font-size: .8rem;
  padding: 0 .25rem;
}
.stream-unread {
  font-size: .3rem;
}
a.router-link-active > .stream-unread {
  display: none;
}

a.streamer {
  display: flex;
  align-items: center;
}
a.streamer > * {
  flex: 0 0 auto;
}
a.streamer > span {
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stream > a {
  font-size: .8rem;
}

.project .stream > a {
  padding-left: 1.5rem;
}
.directory .stream > a {
  padding-left: 2.5rem;
}
.directory.stream > a {
  font-size: 1rem;
}

.stream.RUNNING > a {
  background: #24233e;
}
.stream.ERROR > a {
  background: #3e2222;
}

.stream-action {
  opacity: .1;
}
a:hover > .stream-action {
  opacity: 1;
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
