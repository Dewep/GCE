const AnsiUp = require('ansi_up').default

class CommandStreamStore {
  constructor () {
    this.slug = null
    this.projectSlug = null
    this.directorySlug = null
    this.name = null
    this.args = null
    this.cwd = null
    this.creationDate = null
    this.runningDate = null
    this.stoppedDate = null
    this.output = []

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

  update ({ slug, projectSlug, directorySlug, name, args, cwd, creationDate, runningDate, stoppedDate }) {
    this.slug = slug
    this.projectSlug = projectSlug
    this.directorySlug = directorySlug
    this.name = name
    this.args = args
    this.cwd = cwd
    this.creationDate = creationDate
    this.runningDate = runningDate
    this.stoppedDate = stoppedDate
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

  addOutput (outputs) {
    for (const output of outputs) {
      let content = output.content

      if (output.type === 'stdout') {
        content = this.ansiUpStdout.ansi_to_html(content)
      } else if (output.type === 'stderr') {
        content = this.ansiUpStderr.ansi_to_html(content)
      }

      this.output.push({
        type: output.type,
        date: this._convertDate(output.date),
        content
      })
    }
    // TODO: remove old output
  }
}

export default CommandStreamStore
