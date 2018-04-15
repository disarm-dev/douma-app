import cache from 'config/cache'
import {geodata_in_cache_and_valid} from 'lib/models/geodata/geodata.valid'
import {get_all_spatial_hierarchy_level_names, get_display_name_for_level, get_field_name_for_level} from 'lib/instance_data/spatial_hierarchy_helper'
import {generate_location_selections} from 'lib/debug/generate_location_selection'

/**
 * Sets the __disarm_geo_id and __disarm_geo_name directly on the cache
 * @returns {boolean}
 */
function decorate_geodata_on_cache () {
  if (!geodata_in_cache_and_valid()) return // throw new Error('Invalid geodata')

  const level_names = get_all_spatial_hierarchy_level_names()

  level_names.forEach(level_name => {
    decorate_level(level_name)
  })

  cache.location_selection = generate_location_selections(cache.geodata)

  return true
}

/**
 * Sets in place (i.e. on cache) the '__disarm_geo_id' and '__disarm_geo_name' properties
 * by extracting the correct property (as per instance_config) from the feature.
 * This makes managing geodata easier/possible.
 * @param level_name
 */
function decorate_level(level_name) {
  const field_name = get_field_name_for_level(level_name)
  const display_name = get_display_name_for_level(level_name)

  const level = cache.geodata[level_name]

  const decorated_level_features = level.features.map(feature => {
    feature.properties.__disarm_geo_id = feature.properties[field_name]
    feature.properties.__disarm_geo_name = feature.properties[display_name]
    return feature
  })

  cache.geodata[level_name].features = decorated_level_features
}

export {decorate_geodata_on_cache, decorate_level}

