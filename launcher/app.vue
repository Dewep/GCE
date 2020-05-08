<template>
  <div id="app-content">
    <RouterView id="main-view" />
  </div>
</template>

<script>
export default {
}
</script>

<style>
#app-content {
  display: flex;
  height: 100%;
  width: 100%;
}
#main-view {
  flex: 1 1 auto;
  height: 100%;
  overflow: hidden;
}
</style>
