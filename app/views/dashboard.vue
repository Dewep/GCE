<template>
  <div>
    <div class="dashboard">
      <h1>GCE <sup>{{ gceVersion }}</sup></h1>
      <template v-if="warnings.length">
        <h2>Config warnings</h2>
        <p
          v-for="(warning, $index) in warnings"
          :key="'Dashboard/w/' + $index"
          class="toast-error"
        >
          {{ warning }}
        </p>
      </template>

      <h2>TODO</h2>
      <p class="toast-info">
        ISO: Stream unread
      </p>
      <p class="toast-info">
        ISO: Home project
      </p>
      <p class="toast-info">
        ISO: Set initial config files PandaLab
      </p>
      <p class="toast-info">
        ISO: PandaLab configs
      </p>
      <p class="toast-info">
        ISO: Variables command
      </p>
      <p class="toast-info">
        ISO: Spawn detached command
      </p>
      <p class="toast-info">
        NEW: Update stream close
      </p>
      <p class="toast-info">
        NEW: Bookmarks
      </p>
      <p class="toast-info">
        NEW: Icons <i class="fa fa-play" /> <i class="fa fa-stop" /> <i class="fa fa-redo" /> <a href="https://fontawesome.com/icons?d=gallery&amp;s=solid&amp;m=free">link</a>
      </p>
      <p class="toast-info">
        NEW: Update stream newexec custom start
      </p>
      <p class="toast-info">
        NEW: Custom stream command
      </p>
      <p class="toast-info">
        NEW: Advanced command write
      </p>
      <p class="toast-info">
        NEW: Stdin + ctrl+c
      </p>
      <p class="toast-info">
        NEW: Reconfigure
      </p>

      <h2>How to configure</h2>
      <p class="toast-info">
        TODO: tuto
      </p>
    </div>
  </div>
</template>

<script>
import configStore from '../store/config'

export default {
  name: 'Dashboard',

  setup () {
    return {
      gceVersion: window.gceVersion,
      warnings: configStore.warnings
    }
  }
}
</script>

<style scoped>
#main-view {
  overflow: auto;
}

.dashboard {
  padding: 1rem;
}
</style>
