const storage = require('../storage')
const identifer = require('../identifier')

const state = {
  list: storage.array('commands')
}

const getters = {
  commands: state => state.list || [],

  getCommand: (state, getters) => commandSlug => getters.commands.find(item => item.slug === commandSlug) || null,

  getSidebarCommand: (state, getters) => (directorySlug, commandSlug) => {
    const command = getters.getCommand(commandSlug)

    if (!command) {
      return null
    }

    const status = getters.getProcessStatus(directorySlug, commandSlug)

    const unread = getters.getProcessUnread(directorySlug, commandSlug)

    return {
      ...command,
      status,
      unread
    }
  }
}

const actions = {
  async commandCreate (store, { directorySlug, groupSlug, name, args, detached, stopArgs }) {
    const directory = store.getters.getDirectory(directorySlug)
    const group = store.getters.getGroup(groupSlug)

    if (!directory && !group) {
      throw new Error('Command should be linked to a directory or a group')
    }

    const commandSlug = identifer('c')
    store.commit('COMMAND_CREATE', { commandSlug, name, args, detached, stopArgs })

    if (directory) {
      const commands = [...(directory.commands || []), commandSlug]
      await store.dispatch('directoryUpdate', { directorySlug: directory.slug, commands })
    } else if (group) {
      const commands = [...(group.commands || []), commandSlug]
      await store.dispatch('groupUpdate', { groupSlug: group.slug, commands })
    }

    return commandSlug
  },

  async commandUpdate (store, { commandSlug, name, args, detached, stopArgs }) {
    const command = store.getters.getCommand(commandSlug)

    if (!command) {
      throw new Error('Command not found')
    }

    name = name || command.name
    args = args || command.args
    detached = detached !== undefined ? detached : command.detached
    stopArgs = stopArgs !== undefined ? stopArgs : command.stopArgs

    store.commit('COMMAND_UDPATE', { commandSlug, name, args, detached, stopArgs })
  },

  async commandRemove (store, { commandSlug, directorySlug, groupSlug }) {
    const command = store.getters.getCommand(commandSlug)
    const directory = store.getters.getDirectory(directorySlug)
    const group = store.getters.getGroup(groupSlug)

    if (!command) {
      throw new Error('Command not found')
    }

    if (directory) {
      const commands = directory.commands.filter(command => command !== commandSlug)
      await store.dispatch('directoryUpdate', { directorySlug: directory.slug, commands })
    } else if (group) {
      // @TODO: should be tested
      const commands = group.commands.filter(command => command !== commandSlug)
      await store.dispatch('groupUpdate', { groupSlug: group.slug, commands })
    }

    store.commit('COMMAND_REMOVE', { commandSlug })
  }
}

const mutations = {
  COMMAND_CREATE (state, { commandSlug, name, args, detached, stopArgs }) {
    state.list = [
      ...state.list,
      {
        slug: commandSlug,
        name,
        args,
        detached,
        stopArgs
      }
    ]

    storage.array('commands', state.list)
  },

  COMMAND_UDPATE (state, { commandSlug, name, args, detached, stopArgs }) {
    state.list = state.list.map(command => {
      if (command.slug !== commandSlug) {
        return command
      }

      return {
        slug: command.slug,
        name,
        args,
        detached,
        stopArgs
      }
    })

    storage.array('commands', state.list)
  },

  COMMAND_REMOVE (state, { commandSlug }) {
    state.list = state.list.filter(command => command.slug !== commandSlug)

    storage.array('commands', state.list)
  }
}

module.exports = { state, getters, actions, mutations }
