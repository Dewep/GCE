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
        sidebar start
      </p>
      <p class="toast-info">
        update stream newexec (start)
      </p>
      <p class="toast-info">
        update stream stop
      </p>
      <p class="toast-info">
        update stream restart
      </p>
      <p class="toast-info">
        icons <i class="fa fa-play" /> <i class="fa fa-stop" /> <i class="fa fa-redo" /> <a href="https://fontawesome.com/icons?d=gallery&amp;s=solid&amp;m=free">link</a>
      </p>
      <p class="toast-info">
        sidebar stop
      </p>
      <p class="toast-info">
        sidebar restart
      </p>
      <p class="toast-info">
        stream vue toolbar
      </p>
      <p class="toast-info">
        stream toolbar start, stop, restart, newexec, details on/off
      </p>
      <p class="toast-info">
        stream details : path, cmd, created, dates, exit code, ...
      </p>
      <p class="toast-info">
        stream statut
      </p>
      <p class="toast-info">
        stream unread
      </p>
      <p class="toast-info">
        update stream close
      </p>
      <p class="toast-info">
        set bookmark
      </p>
      <p class="toast-info">
        filter bookmark
      </p>
      <p class="toast-info">
        new custom command
      </p>
      <p class="toast-info">
        advanced command write
      </p>
      <p class="toast-info">
        ctrl+c
      </p>
      <p class="toast-info">
        input stdin
      </p>
      <p class="toast-info">
        home project
      </p>
      <p class="toast-info">
        variables command
      </p>
      <p class="toast-info">
        set initial config files
      </p>
      <p class="toast-info">
        PandaLab configs
      </p>
      <p class="toast-info">
        Limit output lines
      </p>
      <p class="toast-info">
        Notifications
      </p>
      <p class="toast-info">
        Stream auto scroll bot
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
