import router from '.'

export function getStreamRoute (projectSlug, directorySlug, streamSlug, isPrimary) {
  let name = 'directory-stream'
  const params = { projectSlug, directorySlug, streamSlug }

  if (!directorySlug) {
    name = 'project-stream'
    delete params.directorySlug
  }

  if (!projectSlug) {
    name = 'stream'
    delete params.projectSlug
  }

  if (name === 'directory-stream' && isPrimary) {
    name = 'directory'
    delete params.streamSlug
  }

  return { name, params }
}

export function isCurrentRoute (route) {
  const currentRoute = router.currentRoute.value

  if (currentRoute.name !== route.name) {
    return false
  }

  for (const param of Object.keys(route.params)) {
    if (route.params[param] !== currentRoute.params[param]) {
      return false
    }
  }

  for (const param of Object.keys(currentRoute.params)) {
    if (route.params[param] !== currentRoute.params[param]) {
      return false
    }
  }

  return true
}
