import inside from '@turf/inside'
import centroid from '@turf/centroid'
import booleanWithin from '@turf/boolean-overlap'
import { multiPolygon } from '@turf/helpers'
import { getType, getCoords} from '@turf/invariant'

import cache from 'config/cache'
import {get_planning_level_name, get_group_by_for_level} from 'lib/instance_data/spatial_hierarchy_helper'

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

    return inside(centroid(found_area), selected_filter_area) || boolean_within_multipolygons(found_area, selected_filter_area)
  })
  return result
}

function boolean_within_multipolygons(found_area, selected_filter_area) {
  if (found_area.geometry.type === 'MultiPolygon') {
    // convert our selection polygon to a multipolygon
    const coords = getCoords(selected_filter_area)
    selected_filter_area = multiPolygon(coords) 
  }
  
  return booleanWithin(found_area, selected_filter_area)
}

function quick_select_targets_by_risk_inside_focus({areas, selected_filter_area}) {
  if (!Array.isArray(areas)) areas = [areas]

  const planning_level_name = get_planning_level_name()
  const group_by_level_name = get_group_by_for_level(planning_level_name)

  return areas
    .filter(a => a.properties[group_by_level_name] === selected_filter_area.properties.__disarm_geo_name)
    .map(a => a.properties.__disarm_geo_id)
}

export {target_areas_inside_focus_filter_area, quick_select_targets_by_risk_inside_focus}
