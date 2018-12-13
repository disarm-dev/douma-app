import {has, set} from 'lodash'
import {convex, union} from '@turf/turf'

import cache from 'config/cache'

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

export function create_and_sync_fake_data() {}


//
// MAP
//
export const demo_map_config = {
  style: 'mapbox://styles/onlyjsmith/cj0kre65k002k2slaemj9yy0f',
  coords: [33.84455246087134, -20.228122283366602],
  zoom: 4.7,
  map_token: 'pk.eyJ1Ijoib25seWpzbWl0aCIsImEiOiI3R0ZLVGtvIn0.jBTrIysdeJpFhe8s1M_JgA',
}


function create_boundary_polygon() {
  const cache_key = '_demo_boundary_polygon'
  let demo_boundary_polygon

  // check if boundary_layer already exists on cache
  if (has(cache, cache_key)) { return cache.demo_boundary_polygon}

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
  console.log('demo_boundary_polygon', demo_boundary_polygon)
  return demo_boundary_polygon // geojson_fc
}

export function add_boundary_polygon(map) {
  const boundary_layer = create_boundary_polygon()

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