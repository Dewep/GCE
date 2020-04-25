import { ref } from 'vue'
import router from '../router'

class ConfigStore {
  constructor () {
    this.loadBalancers = ref(null)
    this.projects = ref(null)
    this.gce = ref(null)
  }

  loadConfig (config) {
    if (!config) {
      this.loadBalancers.value = null
      this.projects.value = null
      this.gce.value = null
      return
    }

    this.loadBalancers.value = config.loadBalancers
    this.projects.value = config.projects
    this.gce.value = config.gce
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
}

export default new ConfigStore()
