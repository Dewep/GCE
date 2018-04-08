const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const electron = require('electron')

const configFile = path.join(electron.remote.app.getPath('home'), 'gce.yml')
let config = {}
let configError = null
try {
  config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))
} catch (err) {
  configError = err.message
}
const Vue = window.Vue

window.app = new Vue({
  el: '#app',

  data: {
    commands: config.commands || [],
    shell: config.shell,
    menu: {},
    closing: false,
    isForceClose: false,
    active: null,
    status: {},
    unread: {},
    content: {},
    configError,
    colors: [
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?30m/g, color: '#262626' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?31m/g, color: '#b87a7a' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?32m/g, color: '#7ab87a' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?33m/g, color: '#b8b87a' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?34m/g, color: '#7a7ab8' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?35m/g, color: '#b87ab8' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?36m/g, color: '#7ab8b8' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?37m/g, color: '#d9d9d9' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?39m/g, color: '#d9d9d9' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?0m/g, color: '#d9d9d9' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?1m/g, color: '#787878' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?22m/g, color: '#d9d9d9' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?90m/g, color: '#262626' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?91m/g, color: '#b87a7a' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?92m/g, color: '#7ab87a' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?93m/g, color: '#b8b87a' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?94m/g, color: '#7a7ab8' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?95m/g, color: '#b87ab8' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?96m/g, color: '#7ab8b8' },
      { pattern: /(\u001b|\u033b|\x1b)\[([0-9]*;|[0-9]*)?[0-9*]m/g, color: '#d9d9d9' }
    ]
  },

  created () {
    let index = 0
    this.commands.forEach(cmd => {
      const matches = /^(([^/]+)\/)?(.+)$/.exec(cmd.name)
      if (!matches) {
        return
      }

      cmd.section = matches[2] || 'General'
      cmd.title = matches[3]

      if (!this.menu[cmd.section]) {
        this.menu[cmd.section] = []
      }
      this.menu[cmd.section].push(cmd)

      cmd.slug = index + '/' + cmd.name
      index += 1

      cmd.extra = (cmd.extra || config['default-extra'] || []).map(extra => (config.extra || {})[extra]).filter(extra => extra)

      Vue.set(this.status, cmd.slug, 0)
      Vue.set(this.unread, cmd.slug, false)
      Vue.set(this.content, cmd.slug, [])
    })
    window.onbeforeunload = () => {
      if (this.isForceClose) {
        return
      }
      return this.onClose()
    }
  },

  methods: {
    selectCmd (cmd) {
      if (this.active && this.active.slug && this.unread[this.active.slug]) {
        this.unread[this.active.slug] = false
      }
      this.active = cmd
      this.autoScroll()
    },
    autoScroll () {
      const scrollableContent = this.$refs.scrollableContent
      setTimeout(() => {
        scrollableContent.scrollTop = scrollableContent.scrollHeight - scrollableContent.clientHeight
      })
    },
    toHtml (str) {
      str = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/ /g, '&nbsp;')
      str = '<span>' + str
      for (let index in this.colors) {
        let color = this.colors[index]
        str = str.replace(color.pattern, '</span><span style="color:' + color.color + '">')
      }
      str += '</span>'
      return str.replace(/\n/g, '<br>')
    },
    addContent (cmd, type, data) {
      if (this.content[cmd.slug]) {
        if (!cmd.url) {
          const matches = data.match(/running (?:at|on)(?:.*)(?: |:)([0-9]{2,5})/)
          if (matches) {
            cmd.url = 'http://127.0.0.1:' + matches[1]
            cmd.urlText = '127.0.0.1:' + matches[1]
          }
        }
        this.unread[cmd.slug] = true
        this.content[cmd.slug].push({ type, data: this.toHtml(data), time: (new Date()).toLocaleTimeString() })

        if (this.active && cmd.slug === this.active.slug) {
          this.autoScroll()
        }
      }
    },
    getCWD (cmd) {
      return config.root && cmd.path ? path.join(config.root, cmd.path) : (config.root || cmd.path || undefined)
    },
    runCommand (cmd, command, statusOnSuccess = 0) {
      if (this.status[cmd.slug] !== 1 && !cmd.proc) {
        this.status[cmd.slug] = 1
        const cwd = this.getCWD(cmd)

        const callback = (error) => {
          if (error) {
            this.addContent(cmd, 'stderr', error.toString())
          }
        }
        this.addContent(cmd, 'info', cwd ? (cwd + '\n' + command) : command)
        cmd.proc = childProcess.exec(command, { cwd }, callback)

        cmd.proc.stdout.on('data', data => {
          this.addContent(cmd, 'stdout', data.toString())
        })
        cmd.proc.stderr.on('data', data => {
          this.addContent(cmd, 'stderr', data.toString())
        })
        cmd.proc.on('close', code => {
          this.addContent(cmd, 'info', `Process exited with code ${code}`)

          if (cmd.stop || code === 0) {
            this.status[cmd.slug] = statusOnSuccess
          } else {
            this.status[cmd.slug] = 3
          }
          cmd.proc = null
          cmd.stop = false
          if (this.closing) {
            setTimeout(window.close)
          } else if (cmd.restart) {
            cmd.restart = false
            setTimeout(() => this.start(cmd))
          }
        })
      }
    },
    start (cmd) {
      if (cmd && cmd.cmd) {
        this.runCommand(cmd, cmd.cmd, cmd['stop-cmd'] ? 2 : 0)
      }
    },
    stop (cmd) {
      if (cmd.stop) {
        return true
      }
      if (cmd['stop-cmd'] && this.status[cmd.slug] === 2 && !cmd.proc) {
        cmd.stop = true
        this.runCommand(cmd, cmd['stop-cmd'], 0)
        return true
      }
      if (this.status[cmd.slug] === 1 && cmd.proc) {
        this.addContent(cmd, 'info', 'Killing the process...')
        cmd.stop = true
        if (process.platform === 'win32') {
          childProcess.exec('taskkill -F -T -PID ' + cmd.proc.pid)
        } else {
          cmd.proc.kill('SIGINT')
        }
        return true
      }
      return false
    },
    clear (cmd) {
      if (this.content[cmd.slug]) {
        this.content[cmd.slug] = []
      }
    },
    restart (cmd) {
      cmd.restart = true
      this.stop(cmd)
    },
    onClose () {
      let ret = undefined
      this.commands.forEach(cmd => {
        if (this.stop(cmd) || cmd.proc) {
          ret = false
          this.closing = true
        }
      })
      return ret
    },
    forceClose () {
      this.isForceClose = true
      window.close()
    },
    openShell (cmd) {
      if (this.shell && this.shell.length) {
        const cwd = this.getCWD(cmd)
        const argv = this.shell.map(arg => arg.replace('%dir%', cwd))
        const subprocess = childProcess.spawn(argv[0], argv.slice(1), {
          detached: true,
          stdio: 'ignore'
        })
        subprocess.unref()
      }
    },
    openLink (url) {
      electron.shell.openExternal(url)
    }
  }
})
