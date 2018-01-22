import test from 'ava'
import {spatial_bin, spatially_decorate_responses, spatially_decorate_responses_all_levels} from "lib/helpers/spatial_binning"
import {configure_spatial_helpers} from "lib/instance_data/spatial_hierarchy_helper"
import cache from 'config/cache'

import which_polygon from 'which-polygon'

import polygon_fc from './polygons.json'

test('should return binned responses', t => {
  const responses = [{id: 1}, {id: 2}]

  const expected = [{key: 'undefined', values: [{id: 1}, {id: 2}]}]

  const actual = spatial_bin(responses)

  t.deepEqual(actual, expected)
})

test('should bin responses according to their area', t => {
  const responses = [{id: 1, aggregation_field: 1}, {id: 2, aggregation_field: 1}, {id: 3, aggregation_field: 2}]

  const expected = [
    {key: '1', values: [{id: 1, aggregation_field: 1}, {id: 2, aggregation_field: 1}]},
    {key: '2', values: [{id: 3, aggregation_field: 2}]}
  ]

  const actual = spatial_bin(responses)

  t.deepEqual(actual, expected)
})

test('should decorate responses with the area they are in', t => {
  const LEVEL_NAME = 'level_1'

  // Configure spatial_hierarchies
  const instance_config = {
    spatial_hierarchy: {
      levels: [
        {
          name: LEVEL_NAME,
          field_name: 'level_1_field_name'
        }
      ]
    }
  }

  configure_spatial_helpers(instance_config) // TODO: @refac Horrible

  // Setup geodata that matches spatial_hierarchy
  const polygon_query = which_polygon(polygon_fc)

  // Create responses that lie within the geodata specified above
  const responses = [
    {
      point_id: 1,
      area_id_hint: 1,
      location: {
        coords: {
          latitude: 31.116027832031246,
          longitude: -25.98026800746978
        }
      }
    },
    {
      point_id: 2,
      area_id_hint: 1,
      location: {
        coords: {
          latitude: 31.560974121093746,
          longitude: -26.118452068488068
        }
      }
    },
    {
      point_id: 3,
      area_id_hint: 2,
      location: {
        coords: {
          latitude: 31.16546630859375,
          longitude: -26.61063004014913
        }
      }
    },
    {
      point_id: 4,
      area_id_hint: 2,
      location: {
        coords: {
          latitude: 31.475830078124996,
          longitude: -26.674458841825196
        }
      }
    }
  ]
  // run function
  const decorated_responses = spatially_decorate_responses({cloned_responses: responses, level_name: LEVEL_NAME, field_to_save: "level_1_field_name", polygon_query})

  // TODO: @feature Write some assertions to verify output is correct
  // verify there are as many decorated_responses as there are responses for each area
  t.is(decorated_responses.length, 4)

  // verify that the correct level value was added to the response.
  responses.forEach(response => {
    t.is(response.spatial_hierarchy.level_1, response.area_id_hint)
  })
})


test('spatially_decorate_responses_all_levels', t => {
  const LEVEL_NAME = 'level_1'

  // Configure spatial_hierarchies
  const instance_config = {
    spatial_hierarchy: {
      levels: [
        {
          name: LEVEL_NAME,
          field_name: 'level_1_field_name'
        }
      ]
    }
  }

  configure_spatial_helpers(instance_config)

  cache.geodata[LEVEL_NAME] = polygon_fc

  const responses = [
    {
      point_id: 1,
      area_id_hint: 1,
      location: {
        coords: {
          latitude: 31.116027832031246,
          longitude: -25.98026800746978
        }
      }
    },
    {
      point_id: 2,
      area_id_hint: 1,
      location: {
        coords: {
          latitude: 31.560974121093746,
          longitude: -26.118452068488068
        }
      }
    },
    {
      point_id: 3,
      area_id_hint: 2,
      location: {
        coords: {
          latitude: 31.16546630859375,
          longitude: -26.61063004014913
        }
      }
    },
    {
      point_id: 4,
      area_id_hint: 2,
      location: {
        coords: {
          latitude: 31.475830078124996,
          longitude: -26.674458841825196
        }
      }
    }
  ]

  const actual = spatially_decorate_responses_all_levels(responses)

  t.is(actual.length, 4)

  actual.forEach(response => {
    t.is(response.spatial_hierarchy.level_1, response.area_id_hint)
  })
})
