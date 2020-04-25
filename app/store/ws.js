import { ref } from 'vue'
import configStore from './config'

class WsStore {
  constructor () {
    this.connected = ref(false)
    this.loading = ref(false)
    this.error = ref(null)

    this.socket = null
    this.connecting = null
  }

  connect () {
    if (this.socket) {
      return
    }

    this.loading.value = true
    this.error.value = null
    this.connected.value = false
    configStore.loadConfig(null)

    const protocol = 'ws' + (window.location.protocol === 'https:' ? 's' : '')
    this.socket = new WebSocket(`${protocol}://${window.location.host}/ws/`)

    this.connecting = setTimeout(() => {
      if (!this.error.value) {
        this.error.value = 'WS connection timeout.'
      }
      this.disconnect()
    }, 1000)

    this.socket.onopen = () => {
      clearTimeout(this.connecting)
      this.connecting = null
    }

    this.socket.onmessage = event => {
      try {
        const { type, data } = JSON.parse(event.data)

        if (type === 'config') {
          if (this.loading.value || !this.connected.value) {
            this.loading.value = false
            this.connected.value = true
          }

          configStore.loadConfig(data)
        }

        if (type === 'stream-update') {
          // TODO
        }

        if (type === 'stream-redirect') {
          // TODO
        }

        if (type === 'stream-output') {
          // TODO
        }
      } catch (err) {
        console.warn('WS.message', err)
      }
    }

    this.socket.onclose = event => {
      if (!this.error.value) {
        this.error.value = 'WS connection lost.'
      }
      this.disconnect(true)
    }

    this.socket.onerror = error => {
      if (!this.error.value) {
        this.error.value = error.message || 'WS connection error.'
      }
      this.disconnect()
    }
  }

  send (type, data) {
    this.socket.send(JSON.stringify({ type, data }))
  }

  newStream (projectSlug, directorySlug, args, name = null, options = {}) {
    if (!name) {
      name = args.join(' ')
    }
    this.send('newStream', { projectSlug, directorySlug, args, name, options })
  }

  updateStream (streamSlug, action) {
    this.send('updateStream', { streamSlug, action })
  }

  disconnect (alreadyClosed = false) {
    if (!alreadyClosed && this.socket) {
      this.socket.close()
    }

    this.loading.value = false
    this.connected.value = false
    this.socket = null
    // this.error.value = null
    configStore.loadConfig(null)
  }
}

export default new WsStore()