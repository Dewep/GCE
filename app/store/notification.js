import router from '../router'

class Notification {
  constructor () {
    this.permission = (window.Notification && window.Notification.requestPermission && window.Notification.permission) || 'denied'
    this.notificationTimers = {}
  }

  askPermission () {
    if (this.permission !== 'granted' && this.permission !== 'denied') {
      window.Notification.requestPermission(permission => {
        this.permission = permission
        console.info('Notification.requestPermission', permission)
      })
    }
  }

  send (title, body, routeName, routeParams, force) {
    const route = this._formatRoute(routeName, routeParams)

    if (!this._shouldSendNotifications(name, route, force)) {
      return
    }

    try {
      const notification = new window.Notification(title, {
        body: this._formatBody(body),
        icon: '/favicon.png'
      })

      notification.onclick = function (event) {
        if (route) {
          router.push(route)
        }

        try {
          parent.focus()
        } catch (e) {}
        try {
          window.focus()
        } catch (e) {}

        if (notification.close) {
          notification.close()
        }
      }

      setTimeout(() => {
        if (notification.close) {
          notification.close()
        }
      }, 2000)
    } catch (err) {
      console.warn('Notification error', err)
    }
  }

  _formatRoute (routeName, routeParams) {
    const route = { name: routeName, params: routeParams }
    const currentRoute = router.currentRoute.value

    if (currentRoute.name !== route.name) {
      return route
    }

    for (const param of Object.keys(routeParams)) {
      if (routeParams[param] !== currentRoute.params[param]) {
        return route
      }
    }

    return null
  }

  _shouldSendNotifications (name, route, force) {
    if (this.permission !== 'granted') {
      return false
    }

    if (!route) {
      return false
    }

    if (force && this.notificationTimers[name]) {
      clearTimeout(this.notificationTimers[name])
      this.notificationTimers[name] = null
    }

    if (this.notificationTimers[name]) {
      return false
    }

    this.notificationTimers[name] = setTimeout(() => {
      this.notificationTimers[name] = null
    }, 2000)

    return true
  }

  _formatBody (body) {
    if (body.length > 250) {
      body = body.substr(0, 245) + '...'
    }
    return body
  }
}

export default new Notification()
