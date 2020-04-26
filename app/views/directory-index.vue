<template>
  <div class="dir-index">
    <RouterView
      class="dir-content"
    />

    <div class="dir-index-commands">
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
          class="external-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <b>{{ cmd.name }}</b>
          <small>{{ cmd.href }}</small>
        </a>
        <a
          v-else-if="cmd.type === 'command'"
          class="command"
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

      if (dir.commands) {
        for (const slug of Object.keys(dir.commands)) {
          const cmd = dir.commands[slug]
          newCommands.push({
            type: 'command',
            slug,
            name: cmd.name || (slug === 'main' ? cmd.args.join(' ') : slug),
            args: cmd.args,
            description: cmd.args.join(' ')
          })
        }
      }

      commands.value = newCommands
    })

    function runCommand (cmd) {
      wsStore.newCommandStream(props.projectSlug, props.directorySlug, cmd.args, cmd.name, { redirect: true })
    }

    return {
      projectName,
      directoryName,
      commands,
      runCommand
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
  padding-right: 22rem;
}

.dir-index-commands {
  position: absolute;
  top: 1rem;
  right: 2rem;
  width: 20rem;
  text-align: center;
  opacity: .5;
  bottom: 1rem;
  background: #282b2d;
  border-radius: .2rem;
}

.dir-index-commands:hover {
  opacity: 1;
}

.dir-index-commands a {
  padding: 1rem;
  margin: .5rem;
  display: block;
  border-radius: 1rem;
  text-decoration: none;
}

.dir-index-commands a > b,
.dir-index-commands a > small {
  word-break: break-all;
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
</style>
