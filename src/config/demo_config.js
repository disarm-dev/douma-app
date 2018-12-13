import {flatten, has, set} from 'lodash'
import {union} from '@turf/turf'

import cache from 'config/cache'
import {store} from 'apps/store'
import {generate_data} from 'lib/helpers/generate_fake_data'
import {ResponseController} from 'lib/models/response/controller'
import {get_planning_level} from 'lib/instance_data/spatial_hierarchy_helper'

const DEMO_IDENTIFIER = '__is_a_demo' // The property added to the root-level config object

export let __is_a_demo = false

export function check_if_is_a_demo(instance_config) {
  if (instance_config[DEMO_IDENTIFIER]) {
    __is_a_demo = true
  }
}


//
// QUICK FAKE DATA
//

export async function create_and_sync_fake_data() {
  const controller = new ResponseController('record')
  const all_areas_count = cache.geodata[get_planning_level().name].features.length

  try {
    // create some fake data
    const responses = generate_data({state: store.state, areas_count: all_areas_count})
    // store locally
    controller.create_or_update_bulk_local(responses)

    // sync to the remote
    const results = await controller.create_records(responses)
    const last_successful_sync_count = flatten(results.pass).length
    const last_failed_sync_count = flatten(results.fail).length

    // did any responses sync?
    if (last_successful_sync_count > 0) {
      store.commit('root:set_snackbar', {message: `Successfully synced ${last_successful_sync_count} responses`})
    } else if (last_successful_sync_count === 0 && last_failed_sync_count > 0) {
      setTimeout(() => {
        store.commit('root:set_snackbar', {message: `All ${last_failed_sync_count} responses failed to sync`})
      }, 3000)
    } else {
      setTimeout(() => {
        store.commit('root:set_snackbar',
          {message: `${last_successful_sync_count} responses synced, ${last_failed_sync_count} responses failed to sync`})
      }, 3000)
    }

  } catch (e) {
    throw e
  }
}


//
// MAP
//
export const demo_map_config = {
  style: 'mapbox://styles/onlyjsmith/cj0kre65k002k2slaemj9yy0f',
  coords: [33.84455246087134, -20.228122283366602],
  zoom: 4.7,
  map_token: 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA',
}


function get_or_create_boundary_polygon() {
  const cache_key = '_demo_boundary_polygon'
  let demo_boundary_polygon

  // check if boundary_layer already exists on cache
  if (has(cache, cache_key)) {
    return cache[cache_key]
  }

  // load geodata from cache
  const geodata = cache.geodata

  if (Object.keys(geodata).length > 1) {
    // collect all features from all levels
    const unions_of_each_level = Object.keys(geodata).reduce((acc, level_name) => {
      const level = geodata[level_name]
      const level_union = union(...level.features)
      acc = acc.concat(level_union)
      return acc
    }, [])
    demo_boundary_polygon = union(...unions_of_each_level)
  } else {
    const only_level = geodata[Object.keys(geodata)[0]]
    demo_boundary_polygon = union(...only_level.features)
  }

  // store result on cache
  set(cache, cache_key, demo_boundary_polygon)

  return demo_boundary_polygon // geojson_fc
}

export function add_boundary_polygon(map) {
  const boundary_layer = get_or_create_boundary_polygon()

  // add to map and colour
  map.on('load', function () {
    map.addLayer({
      'id': 'demo-outline',
      'type': 'fill',
      'source': {
        'type': 'geojson',
        'data': boundary_layer,
      },
      'layout': {},
      'paint': {
        'fill-color': '#4CAF50',
        'fill-opacity': 0.8
      }
    });
  })

  return map
}