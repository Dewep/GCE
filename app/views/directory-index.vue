<template>
  <div class="dir-index">
    <RouterView
      class="dir-content"
    />

    <div class="dir-index-commands">
      <a
        class="bookmark"
        @click.prevent="toggleBookmark()"
      >
        <i
          :class="[isBookmarked ? 'fa' : 'far']"
          class="fa-bookmark"
        />
      </a>

      <h2>
        <small>{{ projectName }}</small><br>
        {{ directoryName }}
      </h2>

      <div
        v-for="(cmd, $index) in commands"
        :key="$index"
      >
        <a
          v-if="cmd.type === 'external-link'"
          :href="cmd.href"
          class="extra external-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <b>{{ cmd.name }}</b>
          <small>{{ cmd.href }}</small>
        </a>
        <a
          v-else-if="cmd.type === 'command'"
          class="extra command"
          :class="{ detached: cmd.detached }"
          @click.prevent="runCommand(cmd)"
        >
          <b>{{ cmd.name }}</b>
          <small>{{ cmd.description }}</small>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue'
import configStore from '../store/config'
import wsStore from '../store/ws'
import bookmarkStore from '../store/bookmark'

export default {
  name: 'DirectoryIndex',

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
    const projectName = ref(null)
    const directoryName = ref(null)
    const commands = ref([])

    watchEffect(() => {
      const def = configStore.getDirectory(props.projectSlug, props.directorySlug)

      const project = def && def.project
      const dir = def && def.directory

      directory.value = dir || null
      projectName.value = (project && project.name) || props.projectSlug
      directoryName.value = (dir && dir.name) || props.directorySlug
    })

    watchEffect(() => {
      const dir = directory.value
      if (!dir) {
        return
      }

      const newCommands = []

      if (dir.loadBalancer) {
        const hosts = []
        for (const key of Object.keys(dir.loadBalancer)) {
          for (const host of dir.loadBalancer[key].hosts) {
            if (!hosts.includes(host)) {
              hosts.push(host)
            }
          }
        }

        for (const host of hosts) {
          newCommands.push({
            type: 'external-link',
            name: host,
            href: `https://${host}`
          })
        }
      }

      if (dir.extras) {
        for (const slug of Object.keys(dir.extras)) {
          const cmd = dir.extras[slug]
          newCommands.push({
            type: 'command',
            slug,
            name: cmd.name || (slug === 'main' ? cmd.args.join(' ') : slug),
            args: cmd.args,
            detached: cmd.detached,
            description: cmd.args.join(' ')
          })
        }
      }

      commands.value = newCommands
    })

    function runCommand (cmd) {
      if (cmd.detached) {
        wsStore.newCommandDetached(props.projectSlug, props.directorySlug, cmd.args)
      } else {
        wsStore.newCommandStream(props.projectSlug, props.directorySlug, false, cmd.args, cmd.notifications, cmd.name, { redirect: true })
      }
    }

    const isBookmarked = ref(false)

    watchEffect(() => {
      const slug = props.projectSlug + '/' + props.directorySlug
      isBookmarked.value = bookmarkStore.slugs.value.includes(slug)
    })

    function toggleBookmark () {
      bookmarkStore.toggleBookmark(props.projectSlug + '/' + props.directorySlug)
    }

    return {
      projectName,
      directoryName,
      commands,
      runCommand,
      isBookmarked,
      toggleBookmark
    }
  }
}
</script>

<style scoped>
.dir-index {
  position: relative;
  display: flex;
}

.dir-content {
  flex: 1 1 auto;
  overflow-y: auto;
}

.dir-index-commands {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  width: 20.5rem;
  text-align: center;
  opacity: .5;
  bottom: 1rem;
  background: #282b2d;
  border-radius: .5rem .5rem .5rem 0rem;
}

.dir-index-commands a.bookmark {
  position: absolute;
  top: -.3rem;
  left: 1rem;
  color: #FFF;
  font-size: 200%;
}

.dir-index-commands:hover {
  opacity: 1;
}

.dir-index-commands a.extra {
  padding: .6rem 1rem;
  margin: .5rem;
  display: block;
  border-radius: 1rem;
  text-decoration: none;
  border: .1rem solid #1d1f21;
}

.dir-index-commands a.extra > b,
.dir-index-commands a.extra > small {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

a.external-link {
  background: #161656;
}

a.command {
  background: #353544;
}

a.command.detached {
  background: #401656;
}
</style>
