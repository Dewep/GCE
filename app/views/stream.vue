<template>
  <div
    v-if="stream"
    class="stream"
    :class="{ 'in-directory': directorySlug !== null, 'with-information': withInformation }"
  >
    <div
      ref="outputsRef"
      class="outputs"
    >
      <div
        v-for="(line, $index) in outputs"
        :key="line.date + $index"
        :class="[line.type]"
        :data-time="line.date"
        class="output"
      >
        <div v-html="line.content" />
      </div>
    </div>
    <div class="information">
      <label>
        <b>CWD</b>
        <span>{{ cwd }}</span>
      </label>
      <label v-if="creationDate">
        <b>Creation</b>
        <span>{{ creationDate }}</span>
      </label>
      <label v-if="runningDate">
        <b>Running</b>
        <span>{{ runningDate }}</span>
      </label>
      <label v-if="stoppedDate">
        <b>Stopped</b>
        <span>{{ stoppedDate }}</span>
      </label>
      <label v-if="exitCode !== null">
        <b>Exit code</b>
        <span>{{ exitCode }}</span>
      </label>
    </div>
    <div class="toolbar">
      <a
        class="details"
        @click.prevent="withInformation = !withInformation"
      >
        <i class="fa fa-angle-up" />
        <i class="fa fa-angle-down" />
        DETAILS
      </a>
      <a
        v-if="stoppedDate"
        @click.prevent="actionStart()"
      >
        <i class="fa fa-play" />
        Start
      </a>
      <a
        v-if="!stoppedDate"
        @click.prevent="actionStop()"
      >
        <i class="fa fa-stop" />
        Stop
      </a>
      <a
        v-if="!stoppedDate"
        @click.prevent="actionRestart()"
      >
        <i class="fa fa-redo" />
        Restart
      </a>
      <a
        @click.prevent="actionClear()"
      >
        <i class="fa fa-broom" />
        Clear
      </a>
      <a
        v-if="!stoppedDate"
        @click.prevent="actionClose()"
      >
        <i class="fa fa-trash" />
        Close
      </a>
      <a
        class="args"
      >
        {{ fullName }}
      </a>
    </div>
  </div>
</template>

<script>
import configStore from '../store/config'
import { ref, watchEffect, toRefs } from 'vue'
import wsStore from '../store/ws'

export default {
  name: 'Stream',

  props: {
    streamSlug: {
      type: String,
      required: true
    },
    projectSlug: {
      type: String,
      default: null
    },
    directorySlug: {
      type: String,
      default: null
    }
  },

  setup (props) {
    const stream = ref(null)
    const name = ref('N/A')
    const args = ref([])
    const argsName = ref('N/A')
    const fullName = ref('N/A')
    const cwd = ref('N/A')
    const creationDate = ref(null)
    const runningDate = ref(null)
    const stoppedDate = ref(null)
    const exitCode = ref(null)
    const withInformation = ref(false)
    const outputs = ref([])
    const outputsRef = ref(null)

    function formatDate (value, diffWith) {
      const date = new Date(value)

      let hours = date.getHours()
      hours = (hours < 10 ? '0' : '') + hours
      let minutes = date.getMinutes()
      minutes = (minutes < 10 ? '0' : '') + minutes
      let seconds = date.getSeconds()
      seconds = (seconds < 10 ? '0' : '') + seconds
      let milliseconds = date.getMilliseconds()
      milliseconds = (milliseconds < 10 ? '0' : '') + (milliseconds < 100 ? '0' : '') + milliseconds

      const str = `${hours}:${minutes}:${seconds}:${milliseconds}`

      if (diffWith) {
        const diff = Math.round(value - diffWith) / 1000
        if (diff < 5 * 60) {
          return `${str} (${diff}s)`
        }
        return `${str} (${diff / 60} min)`
      }

      return str
    }

    watchEffect(() => {
      const def = configStore.getCommandStream(props.streamSlug, props.projectSlug, props.directorySlug)
      stream.value = def

      if (def) {
        name.value = def.name
        args.value = def.args
        argsName.value = def.args.join(' ')
        fullName.value = name.value
        if (name.value !== argsName.value) {
          fullName.value += ': ' + argsName.value
        }
        cwd.value = def.cwd
        creationDate.value = def.creationDate ? formatDate(def.creationDate) : null
        runningDate.value = def.runningDate ? formatDate(def.runningDate) : null
        stoppedDate.value = def.stoppedDate ? formatDate(def.stoppedDate, def.runningDate) : null
        exitCode.value = def.exitCode
      }
    })

    watchEffect(() => {
      if (!stream.value) {
        return
      }

      outputs.value = [...stream.value.output]

      setTimeout(function () {
        if (outputsRef.value) {
          outputsRef.value.scrollTop = outputsRef.value.scrollHeight
        }
      })
    })

    function actionStart (args) {
      const options = {}
      if (args) {
        options.args = args
      }
      wsStore.updateCommandStream(props.streamSlug, 'start', options)
    }

    function actionStop () {
      wsStore.updateCommandStream(props.streamSlug, 'stop')
    }

    function actionRestart () {
      wsStore.updateCommandStream(props.streamSlug, 'restart')
    }

    function actionClear () {
      if (stream.value) {
        stream.value.clear()
      }
    }

    function actionClose () {
      wsStore.updateCommandStream(props.streamSlug, 'close')
    }

    return {
      ...toRefs(props),
      stream,
      name,
      args,
      argsName,
      fullName,
      cwd,
      creationDate,
      runningDate,
      stoppedDate,
      exitCode,
      withInformation,
      outputs,
      outputsRef,
      actionStart,
      actionStop,
      actionRestart,
      actionClear,
      actionClose
    }
  }
}
</script>

<style scoped>
.stream {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.outputs {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 0 0 1rem 0;
}

.information {
  flex: 0 0 auto;
  background: #c5c8c6;
  margin-left: 1rem;
  padding: 1rem;
  border-radius: .5rem 0 0 0;
  color: #282b2d;
  font-size: 90%;
  display: none;
}

.information label {
  margin: .3rem 2rem .3rem 0;
  display: inline-block;
}

.information label span {
  margin-left: .5rem;
  font-size: 90%;
}

.toolbar {
  flex: 0 0 auto;
  background: #282b2d;
  margin: 0 0 1rem 1rem;
  padding: .5rem;
  border-radius: .5rem 0 0 .5rem;
}

.in-directory .outputs {
  padding-right: 22rem;
}
.in-directory .information, .in-directory .toolbar {
  margin-right: 22rem;
}

.toolbar a {
  padding: .5rem;
  text-decoration: none;
  display: inline-block;
}

.toolbar a.details {
  float: right;
  font-size: 80%;
  opacity: .5;
  user-select: none;
}

.toolbar a.args {
  font-size: 80%;
  opacity: .5;
}

.fa-angle-down {
  display: none;
}
.with-information .information {
  display: block;
}
.with-information .toolbar {
  border-radius: 0 0 0 .5rem;
}
.with-information .fa-angle-up {
  display: none;
}
.with-information .fa-angle-down {
  display: inline;
}

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
  top: .2rem;
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
