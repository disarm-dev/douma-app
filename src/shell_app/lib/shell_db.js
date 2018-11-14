import Dexie from 'dexie'

const db = new Dexie('disarm-shell')
window.__disarm_debug_shell_db = db // TODO: Remove direct DB access?

db.version(1).stores({
  'instance_config': '_id',
  'instances': '_id',
})

export {db}


