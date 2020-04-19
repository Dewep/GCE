import { ref } from 'vue'

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
}

export default new ConfigStore()
