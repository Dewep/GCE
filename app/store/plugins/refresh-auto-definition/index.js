module.exports = function (store) {
  const triggerTypes = ['PROJECT_CREATE', 'PROJECT_UDPATE', 'PROJECT_REMOVE']

  const lastUrls = {}

  store.subscribe(function ({ type, payload }, state) {
    if (triggerTypes.includes(type)) {
      const project = store.getters.getProject(payload.projectSlug)

      if (project && project.url) {
        if (lastUrls[payload.projectSlug] !== project.url) {
          lastUrls[payload.projectSlug] = project.url

          if (!store.getters.getProjectAutoDefinitionStatus(payload.projectSlug).loading) {
            store.dispatch('projectLoadAutoDefinition', { projectSlug: payload.projectSlug })
          }
        }
      } else if (lastUrls[payload.projectSlug]) {
        delete lastUrls[payload.projectSlug]
      }
    }
  })
}
