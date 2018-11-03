const storage = require('./storage')

function identifier (namespace) {
  const nextId = storage.dict('identifiers', namespace) || 1

  storage.dict('identifiers', namespace, nextId + 1)

  return namespace + nextId
}

module.exports = identifier
