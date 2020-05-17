const maxLength = {
  namespace: 0,
  slug: 0
}

const levels = {
  error: true,
  warn: true,
  info: true,
  debug: true
}

function logger (level, prefix, namespace, slug, ...args) {
  if (!levels[level]) {
    return
  }

  const date = new Date()

  let hours = date.getHours()
  hours = (hours < 10 ? '0' : '') + hours
  let minutes = date.getMinutes()
  minutes = (minutes < 10 ? '0' : '') + minutes
  let seconds = date.getSeconds()
  seconds = (seconds < 10 ? '0' : '') + seconds
  let milliseconds = date.getMilliseconds()
  milliseconds = (milliseconds < 10 ? '0' : '') + (milliseconds < 100 ? '0' : '') + milliseconds

  if (namespace.length > maxLength.namespace) {
    maxLength.namespace = namespace.length
  }
  if (slug.length > maxLength.slug) {
    maxLength.slug = slug.length
  }

  // eslint-disable-next-line no-console
  console[level](
    `[${prefix} ${hours}:${minutes}:${seconds}:${milliseconds}] `,
    namespace.padEnd(maxLength.namespace + 1),
    slug.padEnd(maxLength.slug + 1),
    ...args
  )
}

module.exports = {
  setLevel (logLevel) {
    let enabled = true
    for (const level of Object.keys(levels)) {
      levels[level] = enabled
      if (level === logLevel) {
        enabled = false
      }
    }
  },

  debug (...args) {
    logger('debug', '\x1b[36mDEBUG\x1b[0m', ...args)
  },
  info (...args) {
    logger('info', '\x1b[1m\x1b[34mINFO \x1b[0m', ...args)
  },
  warn (...args) {
    logger('warn', '\x1b[1m\x1b[33mWARN \x1b[0m', ...args)
  },
  error (...args) {
    logger('error', '\x1b[1m\x1b[31mERROR\x1b[0m', ...args)
  }
}
