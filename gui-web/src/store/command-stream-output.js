import { reactive } from 'vue'
import AnsiUp from 'ansi_up'
import notification from './notification'
import { getStreamRoute, isCurrentRoute } from '../router/utils'

class CommandStreamOutputStore {
  constructor (defaultNotificationName) {
    this.defaultNotificationName = defaultNotificationName

    this.slug = null
    this.name = null
    this.projectSlug = null
    this.directorySlug = null
    this.primary = false
    this.notificationName = null

    this.output = reactive([])
    // this.outputSize = 0

    this.routeName = null
    this.routeParams = null

    this.ansiUpStdout = this._newAnsiUp()
    this.ansiUpStderr = this._newAnsiUp()
  }

  _newAnsiUp () {
    const ansiUp = new AnsiUp()
    ansiUp.use_classes = true
    ansiUp.escape_for_html = true
    ansiUp.url_whitelist = { http: false, https: true }
    return ansiUp
  }

  update ({ slug, name, projectSlug, directorySlug, primary, notifications }) {
    this.slug = slug
    this.name = name
    this.projectSlug = projectSlug
    this.directorySlug = directorySlug
    this.primary = primary || false
    this.notificationName = null

    if (notifications) {
      notification.askPermission()
      if (this.primary) {
        this.notificationName = this.defaultNotificationName
      }
      if (!this.notificationName) {
        this.notificationName = this.name || this.slug
      }
    }

    this.route = getStreamRoute(this.projectSlug, this.directorySlug, this.slug, this.primary)
  }

  _convertDate (value) {
    const date = new Date(value)

    let hours = date.getHours()
    hours = (hours < 10 ? '0' : '') + hours
    let minutes = date.getMinutes()
    minutes = (minutes < 10 ? '0' : '') + minutes
    let seconds = date.getSeconds()
    seconds = (seconds < 10 ? '0' : '') + seconds
    let milliseconds = date.getMilliseconds()
    milliseconds = (milliseconds < 10 ? '0' : '') + (milliseconds < 100 ? '0' : '') + milliseconds

    return `${hours}:${minutes}:${seconds}:${milliseconds}`
  }

  addOutput (outputs, initial = false) {
    for (const output of outputs) {
      let content = output.content

      if (output.type === 'stdout') {
        content = this.ansiUpStdout.ansi_to_html(content)
      } else if (output.type === 'stderr') {
        content = this.ansiUpStderr.ansi_to_html(content)
      }

      // const size = 1 + (content.match(/\n/g) || []).length
      // this.outputSize += size

      this.output.push({
        type: output.type,
        date: this._convertDate(output.date),
        content
        // size
      })

      if (!initial && this.notificationName && output.type === 'stderr') {
        notification.send(this.notificationName, output.content, this.route)
      }
    }

    while (this.output.length > 1000) {
      this.output.shift()
      // const output = this.output.shift()
      // this.outputSize -= output.size
    }

    const unread = !isCurrentRoute(this.route) && !initial

    return unread
  }

  clear () {
    this.output.length = 0
    // this.outputSize = 0
  }
}

export default CommandStreamOutputStore
