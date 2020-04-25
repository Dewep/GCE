import { ref } from 'vue'
import router from '../router'
import CommandStreamStore from './command-stream'

class ConfigStore {
  constructor () {
    this.loadBalancers = ref(null)
    this.projects = ref(null)
    this.gce = ref(null)
    this.commandStreams = ref([])
  }

  loadConfig (config) {
    if (!config) {
      this.loadBalancers.value = null
      this.projects.value = null
      this.gce.value = null
      this.commandStreams.value = []
      return
    }

    this.loadBalancers.value = config.loadBalancers
    this.projects.value = config.projects
    this.gce.value = config.gce
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

  streamOutput (data) {
    let commandStream = this.commandStreams.value.find(commandStream => commandStream.slug === data.slug)

    if (commandStream && data.output) {
      commandStream.addOutput(data.output)
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

  getCommandStreams (projectSlug, directorySlug) {
    return this.commandStreams.value.filter(commandStream => {
      return commandStream.projectSlug === projectSlug && commandStream.directorySlug === directorySlug
    })
  }

  getCommandStream (projectSlug, directorySlug, streamSlug) {
    const stream = this.commandStreams.value.find(commandStream => {
      return commandStream.projectSlug === projectSlug && commandStream.directorySlug === directorySlug && commandStream.slug === streamSlug
    })

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
