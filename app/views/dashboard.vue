<template>
  <div>
    <template v-if="warnings.length">
      <h1>Config warnings</h1>
      <ul>
        <li
          v-for="(warning, $index) in warnings"
          :key="'Dashboard/w/' + $index"
        >
          {{ warning }}
        </li>
      </ul>
    </template>

    <h1>Dashboard</h1>
    <p>TODO: list of projects, with message if errors (path not found, slug not slugify)</p>
    <p>TODO: tuto</p>
  </div>
</template>

<script>
import configStore from '../store/config'

export default {
  name: 'Dashboard',

  setup () {
    return {
      warnings: configStore.warnings
    }
  }
}
</script>
