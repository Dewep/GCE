import { ref } from 'vue'

class ConfigStore {
  constructor () {
    this.directories = ref([])
    this.ssl = ref(false)
    this.sslDomain = ref('')
    this.proxy = ref(false)
    this.autoStart = ref(false)

    try {
      if (window.localStorage.configs) {
        const options = JSON.parse(window.localStorage.configs)
        if (options.directories) {
          this.directories.value = options.directories
        }
        if (options.ssl) {
          this.ssl.value = options.ssl
        }
        if (options.sslDomain) {
          this.sslDomain.value = options.sslDomain
        }
        if (options.proxy) {
          this.proxy.value = options.proxy
        }
        if (options.autoStart) {
          this.autoStart.value = options.autoStart
        }
      }
    } catch (err) {
      console.warn('Configs.parse', err)
    }
  }

  save () {
    if (!this.sslDomain.value) {
      this.ssl.value = false
    }
    if (!this.ssl.value) {
      this.sslDomain.value = ''
      this.proxy.value = false
    }
    window.localStorage.configs = JSON.stringify({
      directories: this.directories.value,
      ssl: this.ssl.value,
      sslDomain: this.sslDomain.value,
      proxy: this.proxy.value,
      autoStart: this.autoStart.value
    })
  }
}

export default new ConfigStore()
