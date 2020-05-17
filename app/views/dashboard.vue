<template>
  <div>
    <div class="dashboard">
      <h1>GCE <sup>{{ gceVersion }}</sup></h1>
      <template v-if="warnings.length">
        <h2>
          Config warnings
          <button
            class="sm"
            @click.prevent="reconfigure()"
          >
            Rescan path
          </button>
        </h2>
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
        BUG: Do not ask request Notification granted
      </p>
      <p class="toast-info">
        BUG: Do not sync files on missing repositories
      </p>
      <p class="toast-info">
        BUG: Error status but process running
      </p>
      <p class="toast-info">
        NEW: Possibility to choose repositories to sync-files (docs) or run watch (shared)
      </p>
      <p class="toast-info">
        ISO: Home project / Home directory
      </p>
      <p class="toast-info">
        NEW: Git clone stream on directory not found
      </p>
      <p class="toast-info">
        NEW: Custom stream command
      </p>
      <p class="toast-info">
        NEW: Update stream custom start command
      </p>
      <p class="toast-info">
        NEW: Stdin + Ctrl+C
      </p>
      <p class="toast-info">
        NEW: Login protection WS
      </p>
      <p class="toast-info">
        NEW: Electron app to run the 2 commands (<a href="https://github.com/jorangreef/sudo-prompt">sudo-prompt</a>)
      </p>
      <p class="toast-info">
        NEW: Offline mode HTML
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
import wsStore from '../store/ws'

export default {
  name: 'Dashboard',

  setup () {
    function reconfigure () {
      wsStore.reconfigure()
    }

    return {
      gceVersion: window.gceVersion,
      warnings: configStore.warnings,
      reconfigure
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
