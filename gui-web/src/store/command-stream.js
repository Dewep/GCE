const STATUS = {
  STOPPED: 'STOPPED',
  RUNNING: 'RUNNING',
  ERROR: 'ERROR'
}

class CommandStreamStore {
  constructor () {
    this.slug = null
    this.projectSlug = null
    this.directorySlug = null
    this.primary = false
    this.name = null
    this.args = null
    this.cwd = null
    this.env = null
    this.notifications = null
    this.creationDate = null
    this.runningDate = null
    this.runningArgs = null
    this.stoppedDate = null
    this.exitCode = null
    this.status = STATUS.STOPPED
    this.unread = false
  }

  update ({ slug, projectSlug, directorySlug, primary, name, args, cwd, env, notifications, creationDate, runningDate, runningArgs, stoppedDate, exitCode }) {
    this.slug = slug
    this.projectSlug = projectSlug
    this.directorySlug = directorySlug
    this.primary = primary || false
    this.name = name
    this.args = args
    this.cwd = cwd
    this.env = env
    this.notifications = notifications
    this.creationDate = creationDate
    this.runningDate = runningDate
    this.runningArgs = runningArgs
    this.stoppedDate = stoppedDate
    this.exitCode = exitCode

    if (this.runningDate && !this.stoppedDate) {
      this.status = STATUS.RUNNING
    } else if (this.exitCode > 0) {
      this.status = STATUS.ERROR
    } else {
      this.status = STATUS.STOPPED
    }
  }

  static get STATUS () {
    return STATUS
  }
}

export default CommandStreamStore
