const electron = require('electron')

function updateBrowserWindowOptions (settings, browserWindowOptions) {
  const savedBounds = settings.store.get('windowBounds', null)

  if (!savedBounds) {
    return
  }

  const area = electron.screen.getDisplayMatching(savedBounds).workArea

  // If the saved position still valid (the window is entirely inside the display area), use it.
  if (
    savedBounds.x >= area.x &&
    savedBounds.y >= area.y &&
    savedBounds.x + savedBounds.width <= area.x + area.width &&
    savedBounds.y + savedBounds.height <= area.y + area.height
  ) {
    browserWindowOptions.x = savedBounds.x
    browserWindowOptions.y = savedBounds.y
  }

  // If the saved size is still valid, use it.
  if (savedBounds.width <= area.width || savedBounds.height <= area.height) {
    browserWindowOptions.width = savedBounds.width
    browserWindowOptions.height = savedBounds.height
  }

  let saveBoundsTimer = null

  function saveBounds (settings) {
    if (saveBoundsTimer) {
      clearTimeout(saveBoundsTimer)
    }

    saveBoundsTimer = setTimeout(() => {
      saveBoundsTimer = null

      if (settings.window) {
        const bounds = settings.window.getNormalBounds()
        settings.store.set('windowBounds', bounds)
      }
    }, 1000)
  }

  function watcher (settings) {
    if (!settings.window) {
      return
    }

    settings.window.on('resize', () => saveBounds(settings))
    settings.window.on('move', () => saveBounds(settings))
    settings.window.on('close', () => saveBounds(settings))
  }

  setTimeout(() => watcher(settings), 1000)
}

module.exports = updateBrowserWindowOptions
