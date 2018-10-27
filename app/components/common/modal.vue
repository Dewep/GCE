<template>
  <div :class="{ active }" class="modal">
    <div class="modal-overlay" @click="close"/>

    <div class="modal-content">
      <div class="modal-title">
        <a @click.prevent="close">X</a>
        <h2>{{ title }}</h2>
      </div>

      <div v-if="active" class="modal-body">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'modal',

  props: {
    active: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },

  data () {
    return {
    }
  },

  methods: {
    close () {
      this.$emit('update:active', false)
    }
  }
}
</script>
