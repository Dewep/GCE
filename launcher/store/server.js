import { ref } from 'vue'

class ServerStore {
  constructor () {
    this.server = ref(null)
    this.proxy = ref(null)
  }
}

export default new ServerStore()
