<template>
  <div>
    <div class="dashboard">
      <header class="cols">
        <div class="col">
          <img src="../../public/favicon.png">
        </div>
        <div class="col right">
          <a
            href="https://github.com/Dewep/GCE"
            target="_blank"
          >
            Become a sponsor
          </a>
          <br>
          <a
            href="https://github.com/Dewep/GCE"
            target="_blank"
          >
            GCE version {{ gceVersion }}
          </a>
        </div>
      </header>
      <div class="cols">
        <div class="col">
          <div
            class="card-run"
            :class="{ running: isRunning, stopped: !isRunning && directories.length, config: !isRunning && !directories.length }"
          >
            <div class="header header-start">
              <a
                class="action"
                @click.prevent="run()"
              >
                <i class="fa fa-play" />
              </a>
              <div class="description">
                <h2>GCE server</h2>
                <p>Ready to start</p>
              </div>
            </div>
            <div class="header header-stop">
              <a
                class="action"
                @click.prevent="stop()"
              >
                <i class="fa fa-stop" />
              </a>
              <div class="description">
                <h2>GCE server</h2>
                <p>The server is running</p>
              </div>
            </div>
            <div class="header header-config">
              <a class="action">
                <i class="fa fa-exclamation-circle" />
              </a>
              <div class="description">
                <h2>GCE server</h2>
                <p>Configuration required to run GCE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="directories.length"
        class="ft-help ft-help-top"
      >
        <i class="fas fa-share" />
        Let's run GCE now
      </div>
      <div
        v-else
        class="ft-help ft-help-bot"
      >
        <i class="fas fa-reply" />
        Let's add some configurations
      </div>
      <div class="cols">
        <div class="col">
          <div class="card opened">
            <h2>Configuration directories</h2>
            <div>
              <p v-if="!directories.length">No configuration added.</p>

              <ul v-else>
                <li
                  v-for="(directory, $index) in directories"
                  :key="'directory-' + $index"
                >
                  <a @click.prevent="removeDirectory($index)">
                    <i class="fa fa-trash" />
                  </a>
                  {{ directory }}
                </li>
              </ul>

              <div class="add-new-directory">
                <button @click.prevent="addNewDirectoryTrigger()">Add new directory</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card opened">
            <h2>
              Use HTTPS port 443
              <button
                :class="[httpsPort443 ? 'on' : 'off']"
                class="sm"
                @click.prevent="httpsPort443 = !httpsPort443"
              >
                {{ httpsPort443 ? 'ON' : 'OFF' }}
              </button>
            </h2>
            <div>
              <p>GCE HTTPS server port: {{ httpsPort443 ? '443' : '6731' }}</p>
            </div>
          </div>
          <div class="card opened">
            <h2>
              Use HTTP port 80
              <button
                :class="[httpPort80 ? 'on' : 'off']"
                class="sm"
                @click.prevent="httpPort80 = !httpPort80"
              >
                {{ httpPort80 ? 'ON' : 'OFF' }}
              </button>
            </h2>
            <div>
              <p>GCE HTTP server port: {{ httpPort80 ? '80' : '6730' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import configStore from '../store/config'

export default {
  name: 'Config',

  setup () {
    const isRunning = ref(false)

    function addNewDirectory (directories) {
      for (const directory of directories) {
        configStore.directories.value.push(directory)
      }
    }

    onMounted(() => {
      window.onSelectDirectory = addNewDirectory
    })
    onUnmounted(() => {
      window.onSelectDirectory = null
    })

    function addNewDirectoryTrigger () {
      window.selectDirectory()
    }

    function removeDirectory (index) {
      configStore.directories.value.splice(index, 1)
    }

    function run () {
      configStore.save()
      isRunning.value = true
      // window.runProxy(null, console.log, console.log, console.log)
    }

    function stop () {
      configStore.save()
      isRunning.value = false
      // window.runProxy(null, console.log, console.log, console.log)
    }

    return {
      gceVersion: window.gceVersion,
      directories: configStore.directories,
      httpsPort443: configStore.httpsPort443,
      httpPort80: configStore.httpPort80,
      addNewDirectoryTrigger,
      removeDirectory,
      isRunning,
      run,
      stop
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 80rem;
  margin: 0 auto;
  padding: 5rem;
  overflow: auto;
  height: 100%;
}

.dashboard > header {
  margin-bottom: 4rem;
}
.dashboard > header img {
  max-height: 10rem;
}
.dashboard > header .right {
  margin-top: 2rem;
  font-size: 110%;
  line-height: 2rem;
}
.dashboard > header .right a {
  text-decoration: none;
}

.cols {
  display: flex;
}
.col {
  flex: 1 1 auto;
  width: 50%;
}
.right {
  text-align: right;
}

.card-run {
  background: #480101;
  box-shadow: #480101 0 0 0.5rem;
  padding: 1rem;
  margin: 1rem;
}
.card-run.running {
  background: #01480a;
  box-shadow: #01480a 0 0 0.5rem;
}
.card-run.stopped {
  background: #482f01;
  box-shadow: #482f01 0 0 0.5rem;
}
.card-run.running .header-start, .card-run.running .header-config {
  display: none;
}
.card-run.stopped .header-stop, .card-run.stopped .header-config {
  display: none;
}
.card-run.config .header-start, .card-run.config .header-stop {
  display: none;
}
.card-run .header {
  display: flex;
}
.card-run .header a.action {
  flex: 0 0 auto;
  text-decoration: none;
}
.card-run .header a.action i {
  font-size: 4rem;
}
.card-run .header .description {
  flex: 1 1 auto;
  margin-left: 3rem;
}
.card-run .header .description h2 {
  margin: 0 0 1rem;
}

.ft-help {
  color: #737777;
  padding: 2rem 4rem;
  font-size: 1.5rem;
  opacity: 0.4;
  font-style: italic;
}
.ft-help .fas {
  font-size: 3rem;
  margin-right: 1rem;
}
.ft-help .fa-reply {
  transform: rotateZ(-90deg) translate(-1.5rem, 0);
}
.ft-help .fa-share {
  transform: rotateZ(-90deg) translate(0.5rem, 0);
}

.card {
  background: #282b2d;
  box-shadow: #282b2d 0 0 0.5rem;
  padding: 1rem;
  margin: 1rem;
}
.card > h2 {
  font-size: 1rem;
  margin: 0;
  padding: 0 .5rem;
  color: #737777;
}
.card > h2 button {
  float: right;
}
.card > div {
  display: none;
}
.card.opened > div {
  display: block;
}
.card.opened > h2 {
  border-bottom: .1rem solid #1d1f21;
  margin-bottom: 1rem;
  padding-bottom: .5rem;
}

button.on {
  background: #223e24;
  border-color: #3b884b;
}
button.off {
  background: #3e2228;
  border-color: #883b4e;
}

.add-new-directory {
  text-align: right;
  margin-top: 1rem;
}
.add-new-directory input {
  display: none;
}

p {
  margin: 0;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  word-break: break-all;
  margin-bottom: 1rem;
  font-size: 80%;
}
</style>
