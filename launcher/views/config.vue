<template>
  <div>
    <div class="dashboard">
      <div class="cols">
        <div class="col">
          <h1>GCE <small>{{ gceVersion }}</small></h1>
        </div>
        <div class="col right">
          <a
            href="https://github.com/Dewep/GCE"
            target="_blank"
            class="github"
          >
            github.com/Dewep/GCE
          </a>
        </div>
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
          <div
            :class="{ opened: ssl }"
            class="card"
          >
            <h2>
              SSL access
              <button
                :class="[ssl ? 'on' : 'off']"
                class="sm"
                @click.prevent="ssl = !ssl"
              >
                {{ ssl ? 'ON' : 'OFF' }}
              </button>
            </h2>
            <div>
              <input
                v-model="sslDomain"
                type="text"
                placeholder="GCE domain name"
              >
            </div>
          </div>
          <div
            v-show="ssl"
            :class="{ opened: proxy }"
            class="card"
          >
            <h2>
              Proxy 443
              <button
                :class="[proxy ? 'on' : 'off']"
                class="sm"
                @click.prevent="proxy = !proxy"
              >
                {{ proxy ? 'ON' : 'OFF' }}
              </button>
            </h2>
            <div>
              <p>Administrator privileges will be required.</p>
            </div>
          </div>
          <div
            :class="{ opened: autoStart }"
            class="card"
          >
            <h2>
              Servers auto-start
              <button
                :class="[autoStart ? 'on' : 'off']"
                class="sm"
                @click.prevent="autoStart = !autoStart"
              >
                {{ autoStart ? 'ON' : 'OFF' }}
              </button>
            </h2>
            <div>
              <p>GCE processes will start automatically when you start the application.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="cols">
        <div class="col">
          <b>GCE server</b> STOPPED<br>
          <b>Proxy 443</b> DISABLED
        </div>
        <div class="col right">
          <button @click.prevent="run()">Start GCE processes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'Vue'
import configStore from '../store/config'

export default {
  name: 'Config',

  setup () {
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
      window.runProxy(null, console.log, console.log, console.log)
    }

    return {
      gceVersion: window.gceVersion,
      directories: configStore.directories,
      ssl: configStore.ssl,
      sslDomain: configStore.sslDomain,
      proxy: configStore.proxy,
      autoStart: configStore.autoStart,
      addNewDirectoryTrigger,
      removeDirectory,
      run
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 80rem;
  margin: 10rem auto;
}

a.github {
  margin-top: 2rem;
  display: inline-block;
}
.cols {
  display: flex;
  margin-bottom: 5rem;
}
.col {
  flex: 1 1 auto;
  width: 50%;
}
.right {
  text-align: right;
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
