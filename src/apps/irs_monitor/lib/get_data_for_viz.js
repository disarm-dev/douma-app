import {get} from 'lodash'

import {decorate_for_chart, decorate_for_map, decorate_for_pie, decorate_for_table} from './decorate_data_for_viz'
import {categorical_bins, spatial_bins, time_series_bins} from './bin_responses'
import CONFIG from "config/common"

/**
 * Prepare and aggregate data for a basic series chart
 * @param {array} responses - bunch of responses
 * @param {array} targets - from a Plan
 * @param {array} aggregations - extracted from `instance_config`
 * @param {object} options - options
 * @param {string} options.chart_type - "bar", "line"
 * @param {string} [options.bin_by] - property to bin by
 * @param {string} [options.series_by] - property to create series from
 * @param {boolean} [options.cumulative] - used with time_series only, whether or not to create cumulative values
 * @returns {array}
 */
export default function get_data({responses, targets, aggregations, options, geodata}) {

  // filter geodata in here
  const limit_to = get(options, 'limit_to', 'all')
  switch (limit_to) {
    case 'all':
      break
    case 'responses':
      break
    case 'targets':
      break
    default:

  }

  // check got enough options to start
  const chart_type = get(options, 'chart_type', false)

  if (!chart_type) throw new Error("Missing `options.chart_type`")

  // Create categorical or time_series bins of responses

  let binned_responses

  if (options.bin_by) {
    binned_responses = bin_responses(responses, options)
  }

  // The 'decorate' functions below also include the aggregation process

  // Create data in right structure depending on chart_type and options (esp. in 'aggregate_for_chart')
  let data
  switch (chart_type) {
    case 'pie':
      data = decorate_for_pie({responses, targets, aggregations, options})
      break
    case 'bar':
      data = decorate_for_chart({binned_responses, targets, aggregations, options})
      break
    case 'line':
      data = decorate_for_chart({binned_responses, targets, aggregations, options})
      break
    case 'table':
      // internally it uses the decorate_for_map with some additional transformations
      data = decorate_for_table({binned_responses, targets, aggregations, options})
      break
    case 'map':
      data = decorate_for_map({binned_responses, targets, aggregations, options})
      break
    default:
      console.error(`Didn't find an aggregation method for ${options.chart_type}.`)
  }

  return data
}

function bin_responses(responses, options) {
  let binned_responses
  if (options.time_series) {
    binned_responses = time_series_bins({responses, options})
  } else if (options.spatial_bins) {
    binned_responses = spatial_bins({responses, options})
  } else {
    binned_responses = categorical_bins({responses, options})
  }
  const replace_with = CONFIG.applets.irs_monitor.replace_null_key_with
  return replace_null_key_in_binned_responses(binned_responses, replace_with)
}

/**
 *
 * @param {Array} binned_responses
 * @param {String} replace_with
 * @returns {*}
 */
export function replace_null_key_in_binned_responses(binned_responses, replace_with) {
  const index_of_null = binned_responses.findIndex(bin => {
    // null is a string, not null
    return bin.key === 'null'
  })

  if (index_of_null >= 0) {
    // delete binned_responses[index_of_null]
    binned_responses[index_of_null].key = replace_with
  }
  

  return binned_responses
}
