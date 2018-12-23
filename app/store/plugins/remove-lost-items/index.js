module.exports = function (store) {
  function isString (value) {
    return value && typeof value === 'string'
  }

  function isArrayOfStrings (values) {
    return values && Array.isArray(values) && values.every(value => typeof value === 'string')
  }

  let running = false

  async function findAndRemoveLostItems () {
    if (running) {
      return
    }

    running = true

    let missing = false

    let projects = store.getters.projects
    let groups = store.getters.groups
    let directories = store.getters.directories
    let commands = store.getters.commands

    projects = projects.filter(project => {
      if (
        !isString(project.slug) ||
        !isString(project.name) ||
        !isArrayOfStrings(project.directories)
      ) {
        console.warn('[remove-lost-items] remove project', project.slug)
        store.dispatch('projectRemove', { projectSlug: project.slug })
        missing = true
        return false
      }

      return true
    })

    groups = groups.filter(group => {
      if (
        !isString(group.slug) ||
        !isString(group.name) ||
        !isArrayOfStrings(group.commands)
      ) {
        console.warn('[remove-lost-items] remove group', group.slug)
        store.dispatch('groupRemove', { groupSlug: group.slug })
        missing = true
        return false
      }

      return true
    })

    directories = directories.filter(directory => {
      if (
        !isString(directory.slug) ||
        !isString(directory.name) ||
        !isString(directory.path) ||
        !isArrayOfStrings(directory.groups) ||
        !isArrayOfStrings(directory.commands) ||
        !projects.some(project => project.directories.includes(directory.slug))
      ) {
        console.warn('[remove-lost-items] remove directory', directory.slug)
        store.dispatch('directoryRemove', { directorySlug: directory.slug })
        missing = true
        return false
      }

      return true
    })

    commands = commands.filter(command => {
      if (
        !isString(command.slug) ||
        !isString(command.name) ||
        !isArrayOfStrings(command.args) ||
        (
          !groups.some(group => group.commands.includes(command.slug)) &&
          !directories.some(directory => directory.commands.includes(command.slug))
        )
      ) {
        console.warn('[remove-lost-items] remove command', command.slug)
        store.dispatch('commandRemove', { commandSlug: command.slug })
        missing = true
        return false
      }

      return true
    })

    if (missing) {
      running = false
      return
    }

    for (const project of projects) {
      const newDirectories = project.directories.filter(slug => directories.find(item => item.slug === slug))

      if (newDirectories.length !== project.directories.length) {
        console.warn('[remove-lost-items] remove missing directories for project', project.slug)
        await store.dispatch('projectUpdate', { projectSlug: project.slug, directories: newDirectories })
        missing = true
      }
    }

    for (const group of groups) {
      const newCommands = group.commands.filter(slug => commands.find(item => item.slug === slug))

      if (newCommands.length !== group.commands.length) {
        console.warn('[remove-lost-items] remove missing commands for group', group.slug)
        await store.dispatch('groupUpdate', { groupSlug: group.slug, commands: newCommands })
        missing = true
      }
    }

    for (const directory of directories) {
      const newGroups = directory.groups.filter(slug => groups.find(item => item.slug === slug))
      const newCommands = directory.commands.filter(slug => commands.find(item => item.slug === slug))

      if (newGroups.length !== directory.groups.length) {
        console.warn('[remove-lost-items] remove missing groups for directory', directory.slug)
        await store.dispatch('directoryUpdate', { directorySlug: directory.slug, groups: newGroups })
        missing = true
      }
      if (newCommands.length !== directory.commands.length) {
        console.warn('[remove-lost-items] remove missing commands for directory', directory.slug)
        await store.dispatch('directoryUpdate', { directorySlug: directory.slug, commands: newCommands })
        missing = true
      }
    }

    running = false
  }

  setTimeout(findAndRemoveLostItems, 0)

  const triggerTypes = ['PROJECT_UDPATE', 'PROJECT_REMOVE', 'GROUP_UDPATE', 'GROUP_REMOVE', 'DIRECTORY_UDPATE', 'COMMAND_REMOVE']

  store.subscribe(function ({ type, payload }, state) {
    if (triggerTypes.includes(type)) {
      findAndRemoveLostItems()
    }
  })
}
