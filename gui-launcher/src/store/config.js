import { ref } from 'vue'

class ConfigStore {
  constructor () {
    this.directories = ref([])
    this.httpsPort443 = ref(false)
    this.httpPort80 = ref(false)

    try {
      if (window.localStorage.configs) {
        const options = JSON.parse(window.localStorage.configs)
        if (options.directories) {
          this.directories.value = options.directories
        }
        if (options.httpsPort443) {
          this.httpsPort443.value = options.httpsPort443
        }
        if (options.httpPort80) {
          this.httpPort80.value = options.httpPort80
        }
      }
    } catch (err) {
      console.warn('Configs.parse', err)
    }
  }

  save () {
    window.localStorage.configs = JSON.stringify({
      directories: this.directories.value,
      httpsPort443: this.httpsPort443.value,
      httpPort80: this.httpPort80.value
    })
  }
}

export default new ConfigStore()
