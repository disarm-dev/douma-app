import inside from '@turf/inside'
import centroid from '@turf/centroid'

import cache from 'config/cache'
import {get_planning_level_name} from 'lib/instance_data/spatial_hierarchy_helper'

/**
 * Return all area_ids if there's no selected_filter_area
 * @param area_ids
 * @param selected_filter_area
 * @returns {*}
 */
const target_areas_inside_focus_filter_area = ({area_ids, selected_filter_area}) => {
  if (!Array.isArray(area_ids)) area_ids = [area_ids]
  if (!selected_filter_area) return area_ids

  const planning_level_name = get_planning_level_name()

  const result = area_ids.filter(area_id => {
    const found_area = cache.geodata[planning_level_name].features.find(feature => {
      return feature.properties.__disarm_geo_id === area_id
    })

    if (!found_area) return false

    return inside(centroid(found_area), selected_filter_area)
  })
  return result
}

export {target_areas_inside_focus_filter_area}
