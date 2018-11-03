function _rawGet (namespace) {
  try {
    if (!localStorage[namespace]) {
      return null
    }
    return JSON.parse(localStorage[namespace])
  } catch (err) {
    console.warn('[storage] Cannot parse', namespace, err)
    return null
  }
}

function _rawSet (namespace, value) {
  try {
    localStorage[namespace] = JSON.stringify(value)
  } catch (err) {
    console.warn('[storage] Cannot save', namespace, err)
    return null
  }
}

function _rawDelete (namespace) {
  try {
    if (localStorage[namespace]) {
      delete localStorage[namespace]
    }
  } catch (err) {
    console.warn('[storage] Cannot delete', namespace, err)
    return null
  }
}

function _rawUpdate (namespace, value) {
  if (value !== undefined) {
    if (value) {
      _rawSet(namespace, value)
    } else {
      _rawDelete(namespace)
    }
  }
}

function array (namespace, value) {
  _rawUpdate(namespace, value)
  return _rawGet(namespace) || []
}

function object (namespace, value) {
  _rawUpdate(namespace, value)
  return _rawGet(namespace) || {}
}

function dict (namespace, key, value) {
  const obj = object(namespace)

  if (!key) {
    return obj
  }

  if (value !== undefined) {
    if (value === null) {
      delete obj[key]
    } else {
      obj[key] = value
    }

    _rawSet(namespace, obj)
  }

  return obj[key] || null
}

module.exports = {
  array,
  object,
  dict
}
