import get from 'lodash.get'

import cache from 'config/cache'
import {geodata_in_cache_and_valid} from 'lib/models/geodata/geodata.valid'
import {get_all_spatial_hierarchy_levels} from '../instance_data/spatial_hierarchy_helper'

/**
 *
 * @returns {location_selections object, containing array of options}
 */
export const generate_location_selections = () => {
  const location_selections = {}
  if (!geodata_in_cache_and_valid()) throw new Error('Invalid geodata')

  // Find the level with a `group_by_field`
  const all_levels = get_all_spatial_hierarchy_levels()

  all_levels.forEach(level => {
    if (!get(level, 'group_by_field', false)) return
    location_selections[level.name] = generate_location_selection(level)
  })

  return location_selections
}

export const generate_location_selection = (level) => {

  // Get all the features from cache.geodata and extract the id and name, attach the category_field

  const categorised = cache.geodata[level.name].features.map(feature => {
    return {
      id: feature.properties.__disarm_geo_id,
      name: feature.properties.__disarm_geo_name,
      category: feature.properties[level.group_by_field]
    }
  })

  return categorised
}
