import test from 'ava'

import {ChartOptionsSchema} from 'lib/models/charts/chart.schema'

test('fail with empty multi_series array', t => {
  const options = {
    'layout': {
      'showlegend': true,
      'title': 'Room coverage as % of target',
      'yaxis': {
        'title': '% coverage'
      },
      'xaxis': {
        'title': 'Period commencing'
      }
    },
    'chart_type': 'line',
    'time_series': true,
    'bin_by': 'team_name',
    'multi_series': []
  }

  const actual = ChartOptionsSchema(options)

  t.false(actual)
})

test('pass with non-empty multi_series array', t => {
  const options = {
    'layout': {
      'showlegend': true,
      'title': 'Room coverage as % of target',
      'yaxis': {
        'title': '% coverage'
      },
      'xaxis': {
        'title': 'Period commencing'
      }
    },
    'chart_type': 'line',
    'time_series': true,
    'bin_by': 'team_name',
    'multi_series': [{
      'aggregation_name': 'structures sprayed'
    }]
  }

  const actual = ChartOptionsSchema(options)

  t.true(actual)
})

test('fail with empty single_series entry', t => {
  const options = {
    'layout': {
      'showlegend': true,
      'title': 'Room coverage as % of target',
      'yaxis': {
        'title': '% coverage'
      },
      'xaxis': {
        'title': 'Period commencing'
      }
    },
    'chart_type': 'line',
    'time_series': true,
    'bin_by': 'team_name',
    'single_series': {}
  }

  const actual = ChartOptionsSchema(options)

  t.false(actual)

})