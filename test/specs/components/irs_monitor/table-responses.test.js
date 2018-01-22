import test from 'ava'

import get_data from 'apps/irs_monitor/lib/get_data_for_viz'


// Input for get_data
const responses = [
  {
    instance_slug: 'test_instance',
    username: 'test_user',

    id: 'id',
    userAgent: 'chrome',
    recorded_on: 'today',

    form_data: {},
    location: {
      coords: {
        latitude: 24,
        longitude: 31,
        accuracy: 10
      },
      // This has no id
      selection: {
        name: 'custom location'
      }
    }
  },
  {
    instance_slug: 'test_instance',
    username: 'test_user',

    id: 'id',
    userAgent: 'chrome',
    recorded_on: 'today',

    form_data: {},
    location: {
      coords: {
        latitude: 24,
        longitude: 31,
        accuracy: 10
      },
      selection: {
        name: 'location_name_1',
        id: '1'
      }
    }
  }
]

const targets = [{
  area_id: 'id1',
  team_name: 'team 1'
}, {
  area_id: 'id2',
  team_name: 'team 1'
}]

const aggregations = [{
  'name': 'homesteads found',
  'numerator_expr': '1'
}]

const options = {
  'chart_type': 'table',
  'bin_by': 'location.selection.name',
  'aggregation_names': [
    'homesteads found'
  ]
}

test.failing('creates a row for each unique response.location.selection.name', t => {
  // Create expected ouput
  const expected_location_selection_names = responses.map(response => response.location.selection.name).sort()

  // Create actual output
  const response_rows = get_data({responses, targets, aggregations, options})
  const actual_row_names = response_rows.map(row => row.row_name).sort()

  // Assert the number of rows is equal to the number of unique list of response.location.selection.name
  t.deepEqual(expected_location_selection_names, actual_row_names)
})

