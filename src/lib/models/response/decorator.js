// Decorate responses, adding additional fields as needed
import which_polygon from 'which-polygon'

import {get_planning_level_id_field, get_planning_level_name} from "../../instance_data/spatial_hierarchy_helper"
import cache from 'config/cache'
/**
 * Add additional, calculated values to the response - `_decorated` property.
 * The instance_decorator also adds to this property.
 * @param json
 * @param instance_config
 */
export const decorate_responses_from_json = (json, instance_config) => {
  const responses_with_planning_target_area = get_polygon_for_responses(json, instance_config)
  return responses_with_planning_target_area
}

function get_polygon_for_responses(responses, instance_config){
  const planning_level_id_field = get_planning_level_id_field()
  const planning_level_name = get_planning_level_name()
  const planning_target_areas = cache.geodata[planning_level_name]
  const query = which_polygon(planning_target_areas)

  const responses_with_planning_target_area = responses.map(response => {
    const response_point = [response.location.coords.longitude, response.location.coords.latitude]
    const found = query(response_point)
    if (found) {
      // TODO: @doc Explain what the 'planning_target_area' is
      response.planning_target_area = found[planning_level_id_field]
    } else {
      response.planning_target_area = null
    }
    return response
  })

  return responses_with_planning_target_area
}
