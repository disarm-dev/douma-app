import get from 'lodash.get'

import {get_all_spatial_hierarchy_levels} from '../instance_data/spatial_hierarchy_helper'

/**
 *
 * @returns {location_selections object, containing array of options}
 */
export const generate_location_selections = (geodata) => {
  const location_selections = {}

  // Find the level with a `group_by_field`
  const all_levels = get_all_spatial_hierarchy_levels()

  all_levels.forEach(level => {
    if (!get(level, 'group_by_field', false)) return
    location_selections[level.name] = generate_location_selection(geodata, level)
  })

  return location_selections
}

export const generate_location_selection = (geodata, level) => {

  // Get all the features from cache.geodata and extract the id and name, attach the category_field

  const categorised = geodata[level.name].features.map(feature => {
    return {
      id: feature.properties.__disarm_geo_id,
      name: feature.properties.__disarm_geo_name,
      category: feature.properties[level.group_by_field]
    }
  })

  return categorised
}
