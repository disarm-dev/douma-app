import test from 'ava'

import {decorate_for_table} from "apps/irs_monitor/lib/decorate_data_for_viz"
import * as exports from 'apps/irs_monitor/lib/decorate_geodata.js'

test('returns empty array if no binned_responses', t => {
  exports.decorate_geodata = () => ({features: []})

  const actual = decorate_for_table({binned_responses: []})
  const expected = []

  t.deepEqual(actual, expected)
})

test('creates a row with properties specified by aggregation_names', t => {
  exports.decorate_geodata = () => {
    return {
      features: [
        {
          properties: {
            agg1: 1,
            agg2: 2
          }
        },
        {
          properties: {
            agg1: 3,
            agg2: 4
          }
        }
      ]
    }
  }

  const options = {
    aggregation_names: ['agg1', 'agg2']
  }

  const actual = decorate_for_table({binned_responses: [], options})

  const expected = [
    {
      agg1: 1,
      agg2: 2
    },
    {
      agg1: 3,
      agg2: 4
    }
  ]

  t.deepEqual(actual, expected)
})


test('creates a row with properties specified by property_layers', t => {
  exports.decorate_geodata = () => {
    return {
      features: [
        {
          properties: {
            property1: 1,
            property2: 2
          }
        },
        {
          properties: {
            property1: 3,
            property2: 4
          }
        }
      ]
    }
  }

  const options = {
    property_layers: [
      {
        "property": 'property1',
        "label": 'property_1_label'
      },
      {
        "property": 'property2',
        "label": 'property_2_label'
      }
    ]
  }

  const actual = decorate_for_table({binned_responses: [], options})

  const expected = [
    {
      property_1_label: 1,
      property_2_label: 2
    },
    {
      property_1_label: 3,
      property_2_label: 4
    }
  ]

  t.deepEqual(actual, expected)
})