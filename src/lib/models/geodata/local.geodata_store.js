import cache from 'config/cache'
import {decorate_geodata_on_cache} from 'lib/models/geodata/geodata.decorate'
import {get_data_version} from "lib/instance_data/spatial_hierarchy_helper"
import {db} from 'lib/local_db'

const disarm_geodata_key = 'disarm_geodata_key'

/**
 * Save the result of remote.geodata getting straight into IDB
 * @param level_name
 * @param level_geodata
 * @returns {Promise.<void>}
 */
export async function save_geodata_to_idb({level_name, level_geodata}) {
  const existing_record = await retrieve_geodata_from_idb()

  level_geodata._version = get_data_version()

  if (!existing_record) {
    const new_record = {
      disarm_geodata_key,
      geodata: {
        [level_name]: level_geodata
      }
    }

    return db.geodata_collection.put(new_record)
  } else {
    const updated_record = {
      disarm_geodata_key,
      geodata: {
        ...existing_record.geodata,
        ...{
          [level_name]: level_geodata
        }
      }
    }

    return db.geodata_collection.update(disarm_geodata_key, updated_record)
  }
}



function retrieve_geodata_from_idb() {
  return db.geodata_collection.get(disarm_geodata_key)
}

/**
 * Try to retrieve geodata from IDB, and set on cache if it exists
 */
export function hydrate_geodata_cache_from_idb() {
  return retrieve_geodata_from_idb()
    .then((geodata) => {
      if (geodata) {
        cache.geodata = geodata.geodata
        decorate_geodata_on_cache()
      }
      return geodata
    })
}
