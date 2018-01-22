import which_polygon from 'which-polygon'
import {nest} from 'd3-collection'
import {cloneDeep, get, set} from 'lodash'

import {get_geodata_for_level_name} from "lib/helpers/geodata_helpers"
import {
  get_all_spatial_hierarchy_level_names,
  get_field_name_for_level
} from 'lib/instance_data/spatial_hierarchy_helper'

const AGGREGATION_FIELD = 'aggregation_field'

export function spatially_decorate_responses_all_levels(responses) {
  const level_names = get_all_spatial_hierarchy_level_names()

  let cloned_responses = cloneDeep(responses)

  for (let level_name of level_names) {
    // Get list of areas at a certain level
    const level_geodata = get_geodata_for_level_name(level_name)

    // Create spatial index for level
    const polygon_query = which_polygon(level_geodata)

    // We want the id field for that level
    const field_to_save = get_field_name_for_level(level_name)

    cloned_responses = spatially_decorate_responses({cloned_responses, level_name, field_to_save, polygon_query})
  }

  return cloned_responses
}

export function spatially_decorate_responses ({cloned_responses, level_name, field_to_save, polygon_query}) {

  // For each response, query which area response is in
  for (let response_clone of cloned_responses) {
    const {latitude, longitude} = response_clone.location.coords
    const area = polygon_query([latitude, longitude])

    if (area) {
      set(response_clone, `spatial_hierarchy.${level_name}`, area[field_to_save])
    }
  }

  return cloned_responses
}


export function spatial_bin (responses) {
  const bins = nest()
    .key(f => get(f, AGGREGATION_FIELD))
    .entries(responses)

  return bins
}