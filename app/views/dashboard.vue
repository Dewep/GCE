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

      <h2>How to configure</h2>
      <p class="toast-info">
        TODO: list of projects, with message if errors (path not found, slug not slugify)
      </p>
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
.dashboard {
  padding: 1rem;
}
</style>
