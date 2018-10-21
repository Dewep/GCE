<template>
  <div class="flex-column">
    <div class="flex-fixed topbar">
      <h1>{{ projectSlug }} / {{ directorySlug }}<small>C:\Users\Dewep\WorkSpace\pandalab\app\src\server</small></h1>
      <nav>
        <router-link :to="{ name: 'directory-commands', params: { projectSlug, directorySlug } }">Commands</router-link>
        <router-link :to="{ name: 'directory-git', params: { projectSlug, directorySlug } }">GIT</router-link>
        <router-link :to="{ name: 'directory-settings', params: { projectSlug, directorySlug } }">Settings</router-link>
      </nav>
    </div>
    <router-view class="flex-extensible"/>
  </div>
</template>

<script>
module.exports = {
  name: 'project-directory-dashboard',

  props: {
    projectSlug: {
      type: String,
      required: true
    },
    directorySlug: {
      type: String,
      required: true
    }
  }
}
</script>
