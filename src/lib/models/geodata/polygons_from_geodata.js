import {get_planning_level_id_field, get_planning_level_name} from 'lib/instance_data/spatial_hierarchy_helper'
import cache from 'config/cache'

/**
 * Find polygons from cache
 * Filter out undefined
 * @param planning_level_ids
 * @param planning_level_name
 * @param planning_level_id_field
 * @param fn Called inside the map on every feature
 * @returns {Array}
 */
function extract_polygons(planning_level_ids, planning_level_name, planning_level_id_field, fn) {
  // Check if cache.geodata is populated
  if (!Object.keys(cache.geodata).length) return []

  return planning_level_ids.map(planning_level_id => {
    let feature = cache.geodata[planning_level_name].features.find(f => f.properties[planning_level_id_field] === planning_level_id)

    if (!feature) console.error(`Cannot find geodata for ${planning_level_name} {${planning_level_id_field}: ${planning_level_id}}`)

    if (fn) {
      feature = fn(feature)
    }

    return feature
  }).filter(i => i)
}

/**
 * Take an array of area IDs at the instance's planning level.
 * Find them from the geodata cache (checking if it exists and is populated)
 * Call the provided fn (if any) on each found feature
 * @param planning_level_ids
 * @param fn
 * @returns {Array}
 */
const planning_level_ids_to_features = (planning_level_ids, fn) => {
  const planning_level_name = get_planning_level_name()
  const planning_level_id_field = get_planning_level_id_field()

  return extract_polygons(planning_level_ids, planning_level_name, planning_level_id_field, fn)
}

export {planning_level_ids_to_features}
