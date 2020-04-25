<template>
  <div>
    <h1>Hello Vue 3!</h1>
    <button @click="inc">
      Clicked {{ count }} times.
    </button>
    <h1>WS</h1>
    <pre>ConfigLoadBalancers: {{ configLoadBalancers }}</pre>
    <pre>ConfigProjects: {{ configProjects }}</pre>
    <pre>ConfigGce: {{ configGce }}</pre>
    <pre>Loading: {{ wsLoading }}</pre>
    <pre>Error: {{ wsError }}</pre>
    <button @click="connect">
      Connect
    </button>
    <button @click="disconnect">
      Disconnect
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'
import wsStore from './ws'
import configStore from './config'

export default {
  name: 'WS',

  setup () {
    const count = ref(0)
    const inc = () => {
      count.value++
    }

    return {
      count,
      inc,
      wsLoading: wsStore.loading,
      wsError: wsStore.error,
      configLoadBalancers: configStore.loadBalancers,
      configProjects: configStore.projects,
      configGce: configStore.gce,
      connect: () => wsStore.connect(),
      disconnect: () => wsStore.disconnect()
    }
  }
}
</script>

<style scoped>
h1 {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
