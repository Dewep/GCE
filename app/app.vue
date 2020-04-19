<template>
  <div
    v-if="!wsConnected"
    id="ws-loading"
  >
    <div>
      <h1>GCE</h1>
      <template v-if="wsLoading">
        Connecting to GCE server...
      </template>
      <template v-else>
        <p>{{ wsError || 'Disconnected from server' }}</p>
        <button @click.prevent="wsConnect()">
          Try to reconnect
        </button>
      </template>
    </div>
  </div>
  <div
    v-else
    id="app-content"
  >
    <Sidebar id="sidebar" />
    <RouterView id="main-view" />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import wsStore from './store/ws'
import Sidebar from './views/sidebar.vue'

export default {
  components: {
    Sidebar
  },

  setup () {
    onMounted(() => {
      if (!wsStore.connected.value && !wsStore.loading.value) {
        wsStore.connect()
      }
    })

    return {
      wsConnected: wsStore.connected,
      wsLoading: wsStore.loading,
      wsError: wsStore.error,
      wsConnect: () => wsStore.connect()
    }
  }
}
</script>

<style>
#ws-loading {
  width: 100%;
  height: 100%;
  align-content: center;
  display: flex;
  align-items: center;
  text-align: center;
}
#ws-loading > div {
  flex: 1 1 auto;
}
#app-content {
  display: flex;
  height: 100%;
  width: 100%;
}
#sidebar {
  flex: 0 0 auto;
  height: 100%;
  overflow-y: auto;
  width: 20rem;
}
#main-view {
  flex: 1 1 auto;
  height: 100%;
}
</style>
