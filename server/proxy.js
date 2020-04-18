const logger = require('./logger')
const httpProxy = require('http-proxy')

class GCEProxy {
  constructor (gce, lb) {
    this.gce = gce
    this.lb = lb

    this.proxy = null
    this.serversAvailable = []

    this._serverIdMaxLength = 10
  }

  static async create (gce, lb) {
    const instance = new this(gce, lb)

    await instance.loadAvailableServers()
    await instance.create()

    return instance
  }

  async loadAvailableServers () {
    for (const projectSlug of Object.keys(this.gce.config.projects)) {
      const project = this.gce.config.projects[projectSlug]

      for (const directorySlug of Object.keys(project.directories)) {
        const directory = project.directories[directorySlug]

        if (!directory.loadBalancer) {
          continue
        }

        for (const serverSlug of Object.keys(directory.loadBalancer)) {
          this.serversAvailable.push({
            slug: `${projectSlug}:${directorySlug}:${serverSlug}`,
            hosts: directory.loadBalancer[serverSlug].hosts,
            ports: directory.loadBalancer[serverSlug].ports,
            path: directory.loadBalancer[serverSlug].path || null,
            pathNot: directory.loadBalancer[serverSlug].pathNot || null,
            roundRobinPortIndex: directory.loadBalancer[serverSlug].ports.length - 1
          })
        }
      }
    }

    this.serversAvailable.push({
      slug: 'GCE:HTTP',
      hosts: this.gce.config.gce.hosts,
      ports: [this.gce.config.gce.port],
      path: null,
      pathNot: null,
      roundRobinPortIndex: 0
    })
  }

  async create () {
    this.proxy = httpProxy.createProxyServer({})

    this.proxy.on('error', function (err, req, res) {
      logger.warn('Proxy HTTP', 'Service Unavailable', err)
      if (res) {
        try {
          res.writeHead(503)
          res.write('503 Service Unavailable')
          res.end()
        } catch (e) {}
      }
    })
  }

  _getMatchServer (host, url) {
    const servers = this.serversAvailable.filter(function (server) {
      return (!server.hosts.length || server.hosts.includes(host)) &&
        (!server.path || url.startsWith(server.path)) &&
        (!server.pathNot || !url.startsWith(server.pathNot))
    })

    servers.sort(function (a, b) {
      return (b.path ? b.path.length : 0) - (a.path ? a.path.length : 0)
    })

    if (!servers.length) {
      return null
    }

    const server = servers[0]
    server.roundRobinPortIndex = (server.roundRobinPortIndex + 1) % server.ports.length

    return server
  }

  proxyRequest (req, res) {
    const server = this._getMatchServer(req.headers.host, req.url)

    if (!server) {
      return false
    }

    const port = server.ports[server.roundRobinPortIndex]
    logger.debug('Proxy HTTP', `${server.slug}:${port}`, req.url)

    this.proxy.web(req, res, {
      target: {
        host: '127.0.0.1',
        port
      },
      ssl: this.lb.serverOptions
    })

    return true
  }

  proxyUpgrade (req, socket, head) {
    const server = this._getMatchServer(req.headers.host, req.url)

    if (!server) {
      return false
    }

    const port = server.ports[server.roundRobinPortIndex]
    logger.debug('Proxy WS', `${server.slug}:${port}`, req.url)

    this.proxy.ws(req, socket, head, {
      target: {
        host: '127.0.0.1',
        port
      },
      ssl: this.lb.serverOptions
    })

    return true
  }
}

module.exports = GCEProxy
