import test from 'ava'

import cache from 'config/cache'
import {geodata_in_cache_and_valid} from 'lib/models/geodata/geodata.valid'
import {configure_spatial_helpers} from 'lib/instance_data/spatial_hierarchy_helper'

const instance_config = {
  spatial_hierarchy: {
    'data_version': 1,
    'markers': {
      'planning_level_name': 'villages',
      'record_location_selection_level_name': 'constituencies',
      'denominator_fields': {
        'number_of_households': 'NumHouseholds'
      }
    },
    'levels': [
      {
        'group_by_field': 'REGION',
        'field_name': 'OBJECTID',
        'display_field_name': 'CONST',
        'name': 'constituencies'
      },
      {
        'field_name': 'id',
        'display_field_name': 'name',
        'name': 'villages'
      }
    ]
  }
}

// TODO: @refac So the underlying model so that tests can really (transparently) test the functionality
configure_spatial_helpers(instance_config)

test('can validate empty geojson', t => {
  const geodata = {}

  cache.geodata = geodata
  const is_valid = geodata_in_cache_and_valid()
  t.false(is_valid)
})

test('can validate keys but no geojson', t => {
  const geodata = {
    villages: {},
    constituencies: {}
  }

  cache.geodata = geodata
  const is_valid = geodata_in_cache_and_valid()
  t.false(is_valid)
})

test('can validate keys but invalid geojson', t => {
  const geodata = {
    villages: {fake_data: 'I am not geojson'},
    constituencies: {fake_data: 'I am not geojson'}
  }

  cache.geodata = geodata
  const is_valid = geodata_in_cache_and_valid()
  t.false(is_valid)
})

test('can validate keys with invalid geojson', t => {
  const geodata = {
    villages: {
      type: 'FeatureCollection',
    },
    constituencies: {
      type: 'FeatureCollection',
    }
  }

  cache.geodata = geodata
  const is_valid = geodata_in_cache_and_valid()
  t.false(is_valid)
})

test.skip('can validate correct keys and geojson', t => {
  const geodata = {
    villages: {
      type: 'FeatureCollection',
      features: [{
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            [
              [
                -19.6875,
                70.25945200030638
              ],
              [
                -151.875,
                -10.487811882056683
              ],
              [
                54.140625,
                17.97873309555617
              ],
              [
                -19.6875,
                70.25945200030638
              ]
            ]
          ]
        }
      }]
    },
    constituencies: {
      type: 'FeatureCollection',
      features: [{
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            [
              [
                -19.6875,
                70.25945200030638
              ],
              [
                -151.875,
                -10.487811882056683
              ],
              [
                54.140625,
                17.97873309555617
              ],
              [
                -19.6875,
                70.25945200030638
              ]
            ]
          ]
        }
      }]
    }
  }

  cache.geodata = geodata
  const is_valid = geodata_in_cache_and_valid()
  t.true(is_valid)
})
