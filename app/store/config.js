import { ref } from 'vue'
import router from '../router'
import CommandStreamStore from './command-stream'

class ConfigStore {
  constructor () {
    this.warnings = ref([])
    this.loadBalancers = ref([])
    this.projects = ref(null)
    this.commandStreams = ref([])
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
  }

  streamUpdate (data) {
    let commandStream = this.commandStreams.value.find(commandStream => commandStream.slug === data.slug)

    if (!commandStream) {
      commandStream = new CommandStreamStore()
      commandStream.update(data)
      this.commandStreams.value.push(commandStream)
    } else {
      commandStream.update(data)
    }
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
    let commandStream = this.commandStreams.value.find(commandStream => commandStream.slug === data.slug)

    if (commandStream && data.output) {
      commandStream.addOutput(data.output, data.initial)
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
}

export default new ConfigStore()
