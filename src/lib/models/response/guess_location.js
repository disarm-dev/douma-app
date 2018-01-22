import {get, set} from 'lodash'
import {get_planning_level_name} from 'lib/instance_data/spatial_hierarchy_helper'
import {featureCollection, point} from '@turf/helpers'
import bounding_box from '@turf/bbox'
import rbush from 'rbush'
import boolean_point_in_polygon from '@turf/boolean-point-in-polygon'
import fast_levenshtein from 'fast-levenshtein'

import cache from 'config/cache'
import {store} from 'apps/store'

export function guess_location_for(responses) {
  let fixed = 0
  let fixes = []

  const planning_level_name = get_planning_level_name()
  const planning_level_fc = cache.geodata[planning_level_name]
  const area_features = planning_level_fc.features
  const bboxes = area_features.map(f => {
    return bbox_and_id(f, '__disarm_geo_id')
  })

  const tree = rbush()
  tree.load(bboxes)

  // Try to find and add location.selection where only location.selection.name exists
  const responses_with_guesses = responses.map(response => {
    // return response if already have an location.selection.id
    if (get(response, 'location.selection.id', false)) {
      //console.log('record with locations')
      set(response, 'location.selection.is_guessed', false)
      return response
    }

    // do hunting and finding
    const response_point = point([response.location.coords.longitude, response.location.coords.latitude])
    const coords_bbox = bbox_and_id(response_point, '__disarm_geo_id')
    const bbox_search_result = tree.search(coords_bbox)

    if (!bbox_search_result.length) {
      fixes.push({message: `Point not in any village ${get(response, 'location.selection.name')}`, response})
      set(response, 'location.selection.is_guessed', false)
      return response
    }

    const guessed_location_polygon = bbox_search_result.filter(res => {
      return boolean_point_in_polygon(response_point, res.feature, {ignoreBoundary: true})
    })[0]

    if (typeof guessed_location_polygon !== 'undefined') {

      // check edit-distance, log out if above threshold
      const written_in_name = get(response, 'location.selection.name', '')
      const found_name = get(guessed_location_polygon, 'feature.properties.__disarm_geo_name')
      const found_id = get(guessed_location_polygon, 'feature.properties.__disarm_geo_id')

      const distance = fast_levenshtein.get(written_in_name, found_name)

      if (distance > 20) {
        fixes.push({message: `Matching ${written_in_name} to ${found_name}, exceeds name-distance threshold. Still adding as suggestion.`, response})
      }

      // add guessed_location_polygon attributes to response.location.selection
      const location_selection_from_list = store.state.instance_config.location_selection.villages.find(v => v.id === found_id)

      // Success - have guessed a location, nothing to push to `fixes`
      if (typeof location_selection_from_list !== 'undefined') {
        response.location.selection = location_selection_from_list
        fixed++
        set(response, 'location.selection.is_guessed', true)
        return response
      }

      fixes.push({message: 'Found a polygon not in location_selection list', response})
      set(response, 'location.selection.is_guessed', false)
      return response

    } else {
      fixes.push({message: `Point not in any village ${get(response, 'location.selection.name')}`, response})
      set(response, 'location.selection.is_guessed', false)
      return response
    }

  })

  console.log('Automatic suggesting of location for responses without location.selection.id (write-ins): fixed count', fixed, 'details', fixes)
  store.commit('irs_record_point/add_fixes', fixes.length)
  store.commit('irs_record_point/add_guessed_responses', fixed)
  return responses_with_guesses
}

function bbox_and_id(feature, field) {
  const bbox = bounding_box(feature.geometry)
  return {
    id: feature.properties[field],
    minX: bbox[0],
    minY: bbox[1],
    maxX: bbox[2],
    maxY: bbox[3],
    feature
  }
}

window.bbox_and_id = bbox_and_id