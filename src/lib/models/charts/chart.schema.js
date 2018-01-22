import schema from 'js-schema'

const SeriesOption = schema({
  aggregation_name: String
})

export const ChartOptionsSchema = schema({
  layout: {
    showlegend: Boolean,
    title: String,
    'yaxis': {
      'title': String
    },
    'xaxis': {
      'title': String
    }
  },
  chart_type: ['line', 'bar'],
  time_series: Boolean,
  bin_by: String,
  '?single_series': SeriesOption,
  '?multi_series': Array.of_x(1, Infinity, SeriesOption)
})

export const ChartSchema = schema({
  id: String,
  style: {
    height_constraint: ['none'],
    width_constraint: ['half']
  },
  options: ChartOptionsSchema
})
