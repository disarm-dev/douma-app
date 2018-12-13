import cache from 'config/cache'
import {decorate_geodata_on_cache} from './geodata.decorate'
import {db} from 'lib/local_db'

/**
 * Save the result of remote.geodata getting straight into IDB
 * @returns {Promise.<void>}
 * @param geodata_level
 */
export async function save_geodata_level_to_idb(geodata_level) {
  const new_record = {
    disarm_geodata_key: geodata_level._id,
    ...geodata_level
  }

  return db.geodata_collection.put(new_record)
}


function retrieve_geodata_from_idb(instance_id) {
  // TODO: Refactor to use indices if this is running slowly.
  return db.geodata_collection.filter(i => i.instance_id === instance_id).toArray()
}

/**
 * Try to retrieve geodata from IDB, and set on cache if it exists
 * Side-effect on cache
 */
export async function hydrate_geodata_cache_from_idb(instance_id) {
  try {
    const retrieved_levels = await retrieve_geodata_from_idb(instance_id)
    if (retrieved_levels) {
      cache.geodata = retrieved_levels.reduce((acc, level) => {
        acc[level.level_name] = level.geojson
        return acc
      }, {})
      decorate_geodata_on_cache()
    }
  } catch (e) {
    throw e
  }
}
