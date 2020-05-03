import { ref } from 'vue'
import router from '../router'
import CommandStreamStore from './command-stream'
import CommandStreamOutputStore from './command-stream-output'

class ConfigStore {
  constructor () {
    this.warnings = ref([])
    this.loadBalancers = ref([])
    this.projects = ref(null)
    this.commandStreams = ref([])
    this.commandStreamsOutput = {}
  }

  loadConfig (config) {
    if (!config) {
      this.warnings.value = []
      this.loadBalancers.value = []
      this.projects.value = null
      return
    }

    this.warnings.value = config.warnings
    this.loadBalancers.value = config.loadBalancers
    this.projects.value = config.projects
  }

  reset () {
    this.loadConfig(null)
    this.commandStreams.value = []
    this.commandStreamsOutput = {}
  }

  streamUpdate (data) {
    let commandStream = this.commandStreams.value.find(commandStream => commandStream.slug === data.slug)

    if (!commandStream) {
      commandStream = new CommandStreamStore()
      commandStream.update(data)
      this.commandStreams.value.push(commandStream)
      this.commandStreamsOutput[data.slug] = new CommandStreamOutputStore()
      this.commandStreamsOutput[data.slug].update(data)
    } else {
      commandStream.update(data)
      if (this.commandStreamsOutput[data.slug]) {
        this.commandStreamsOutput[data.slug].update(data)
      }
    }
  }

  streamRemove (data) {
    this.commandStreams.value = this.commandStreams.value.filter(commandStream => commandStream.slug !== data.slug)
    delete this.commandStreamsOutput[data.slug]
  }

  streamRedirect ({ streamSlug }) {
    const stream = this.commandStreams.value.find(commandStream => commandStream.slug === streamSlug)

    if (stream && stream.projectSlug && stream.directorySlug) {
      router.push({ name: 'directory-stream', params: { projectSlug: stream.projectSlug, directorySlug: stream.directorySlug, streamSlug } })
    } else if (stream && stream.projectSlug) {
      router.push({ name: 'project-stream', params: { projectSlug: stream.projectSlug, streamSlug } })
    }
  }

  streamOutput (data) {
    const streamSlug = data.slug

    if (this.commandStreamsOutput[streamSlug]) {
      const unread = this.commandStreamsOutput[streamSlug].addOutput(data.output, data.initial)

      if (!unread) {
        return
      }

      const commandStream = this.commandStreams.value.find(commandStream => commandStream.slug === streamSlug)
      if (!commandStream.unread) {
        commandStream.unread = true
      }
    }
  }

  markAsRead (streamSlug) {
    const commandStream = this.commandStreams.value.find(commandStream => commandStream.slug === streamSlug)

    if (commandStream.unread) {
      commandStream.unread = false
    }
  }

  getProject (projectSlug) {
    const project = (this.projects.value && this.projects.value[projectSlug]) || null

    if (!project) {
      router.push({ name: 'dashboard' })
      return null
    }

    return project
  }

  getDirectory (projectSlug, directorySlug) {
    const project = this.getProject(projectSlug)

    if (!project) {
      return null
    }

    const directory = project.directories && project.directories[directorySlug]

    if (!directory) {
      router.push({ name: 'project', params: { projectSlug } })
      return null
    }

    return {
      project,
      directory
    }
  }

  getAllCommandStreams () {
    return this.commandStreams.value
  }

  getCommandStreams (projectSlug, directorySlug) {
    return this.commandStreams.value.filter(commandStream => {
      return commandStream.projectSlug === projectSlug &&
        commandStream.directorySlug === directorySlug
    })
  }

  getDirectoryStreamPrimary (projectSlug, directorySlug) {
    const stream = this.commandStreams.value.find(commandStream => {
      return commandStream.projectSlug === projectSlug &&
        commandStream.directorySlug === directorySlug &&
        commandStream.primary === true
    })

    if (!stream) {
      return null
    }

    return stream.slug
  }

  getCommandStream (streamSlug, projectSlug, directorySlug) {
    const stream = this.commandStreams.value.find(commandStream => commandStream.slug === streamSlug)

    if (!stream) {
      if (directorySlug) {
        router.push({ name: 'directory', params: { projectSlug, directorySlug } })
      } else {
        router.push({ name: 'project', params: { projectSlug } })
      }
      return null
    }

    return stream
  }

  getCommandStreamsOutput (streamSlug) {
    return this.commandStreamsOutput[streamSlug] || null
  }
}

export default new ConfigStore()
