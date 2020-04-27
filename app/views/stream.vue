<template>
  <div v-if="stream">
    <div
      v-for="line in stream.output"
      :key="line.date"
      :class="[line.type]"
      :data-time="line.date"
      class="output"
    >
      <div v-html="line.content" />
    </div>
  </div>
</template>

<script>
import configStore from '../store/config'
import { ref, watchEffect, toRefs } from 'vue'

export default {
  name: 'Stream',

  props: {
    projectSlug: {
      type: String,
      required: true
    },
    directorySlug: {
      type: String,
      required: true
    },
    streamSlug: {
      type: String,
      required: true
    }
  },

  setup (props) {
    const stream = ref(null)

    watchEffect(() => {
      const def = configStore.getCommandStream(props.projectSlug, props.directorySlug, props.streamSlug)
      stream.value = def
    })

    return {
      ...toRefs(props),
      stream
    }
  }
}
</script>

<style scoped>
.output {
  padding: .1rem 6rem .1rem .5rem;
  position: relative;
  font-size: .8rem;
}

.output.stderr {
  background: #3e2222;
}
.output.info {
  background: #24223e;
}

.output:after {
  top: .3rem;
  opacity: .5;
  content: attr(data-time);
  display: block;
  font-size: .7rem;
  right: .5rem;
  pointer-events: none;
  position: absolute;
  white-space: pre;
  z-index: 300;
}
.output:hover:after {
  opacity: 1;
}

.output > div {
  white-space: pre-wrap;
  word-break: break-all;
}

.output::v-deep(.ansi-black-fg) { color: #3A3A3A; }
.output::v-deep(.ansi-red-fg) { color: #DD948E; }
.output::v-deep(.ansi-green-fg) { color: #B6D1AA; }
.output::v-deep(.ansi-yellow-fg) { color: #F3D57C; }
.output::v-deep(.ansi-blue-fg) { color: #8AA9D5; }
.output::v-deep(.ansi-magenta-fg) { color: #CBAFD5; }
.output::v-deep(.ansi-cyan-fg) { color: #9AD1D4; }
.output::v-deep(.ansi-white-fg) { color: #EFEFEF; }
.output::v-deep(.ansi-bright-black-fg) { color: #5E5D5E; }
.output::v-deep(.ansi-bright-red-fg) { color: #E69B94; }
.output::v-deep(.ansi-bright-green-fg) { color: #D1F0C3; }
.output::v-deep(.ansi-bright-yellow-fg) { color: #F4D799; }
.output::v-deep(.ansi-bright-blue-fg) { color: #A6CBFE; }
.output::v-deep(.ansi-bright-magenta-fg) { color: #E7C7F2; }
.output::v-deep(.ansi-bright-cyan-fg) { color: #B0F0F5; }
.output::v-deep(.ansi-bright-white-fg) { color: #FFF; }
.output::v-deep(.ansi-black-bg) { background-color: #3A3A3A; }
.output::v-deep(.ansi-red-bg) { background-color: #DD948E; }
.output::v-deep(.ansi-green-bg) { background-color: #B6D1AA; }
.output::v-deep(.ansi-yellow-bg) { background-color: #F3D57C; }
.output::v-deep(.ansi-blue-bg) { background-color: #8AA9D5; }
.output::v-deep(.ansi-magenta-bg) { background-color: #CBAFD5; }
.output::v-deep(.ansi-cyan-bg) { background-color: #9AD1D4; }
.output::v-deep(.ansi-white-bg) { background-color: #EFEFEF; }
.output::v-deep(.ansi-bright-black-bg) { background-color: #5E5D5E; }
.output::v-deep(.ansi-bright-red-bg) { background-color: #E69B94; }
.output::v-deep(.ansi-bright-green-bg) { background-color: #D1F0C3; }
.output::v-deep(.ansi-bright-yellow-bg) { background-color: #F4D799; }
.output::v-deep(.ansi-bright-blue-bg) { background-color: #A6CBFE; }
.output::v-deep(.ansi-bright-magenta-bg) { background-color: #E7C7F2; }
.output::v-deep(.ansi-bright-cyan-bg) { background-color: #B0F0F5; }
.output::v-deep(.ansi-bright-white-bg) { background-color: #FFF; }
</style>
