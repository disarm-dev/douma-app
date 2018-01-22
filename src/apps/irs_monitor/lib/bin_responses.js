import {nest} from 'd3-collection'
import {ascending} from 'd3-array'
import {get, has, isString, isArray} from 'lodash'

import moment_original from 'moment-mini'
import {extendMoment} from 'moment-range'
const moment = extendMoment(moment_original)


/**
 * C
 * @param responses
 * @param options
 * @return {array} binned_responses
 */
export function categorical_bins({responses, options}) {
  // check input
  const bin_by = get(options, 'bin_by', null)

  if (bin_by === null) throw new Error('Missing options.bin_by')
  if (bin_by.length === 0) throw new Error('bin_by must not be an empty string or empty array')

  let binned_responses

  if (isString(bin_by)) {
    // handle string
    // split/bin into series
    binned_responses = nest()
      .key(f => get(f, bin_by))
      .sortKeys(ascending)
      .entries(responses)

  } else if (isArray(bin_by)) {
    // handle array
    const binned_not_sorted= bin_by.map((key) => {
      const values = responses.filter((response) => {
        return has(response, key)
      })
      return {key, values}
    })

    binned_responses = binned_not_sorted.sort((a, b) => {
      return a.key.localeCompare(b.key)
    })



  } else {
    throw new Error('bin_by must be a string or non-empty array')
  }

  return binned_responses
}

/**
 * Create bins for a time series
 * @param responses
 * @param options
 * @returns {Array} - responses binned by time series (with gaps filled!)
 */
export function time_series_bins({responses, options}) {
  // from configuration/options
  const defaults = {
    // in addition need a series property passed in on options
    key_format: 'D MMM',
    temporal_aggregation_level: 'week',
  }

  options = {...defaults, ...options}

  // account for weeks starting on sunday
  const moment_interval = options.temporal_aggregation_level === 'week' ? 'isoWeek' : options.temporal_aggregation_level

  // split/bin into series
  const simple_binned_responses = nest()
    .key(f => {
      const raw_date = f[options.bin_by]
      return moment(raw_date).startOf(moment_interval).format()
    })
    .sortKeys(ascending)
    .entries(responses)


  // fill any gaps in timeseries
  const earliest = simple_binned_responses[0].key
  const latest = simple_binned_responses[simple_binned_responses.length - 1].key
  const date_range = moment.range(earliest, latest)

  let binned_responses = []

  for (let step_date of date_range.by(options.temporal_aggregation_level)) {
    const week_commencing = moment(step_date).format()
    const step_date_formatted = moment(step_date).format(options.key_format)
    const bin_response = simple_binned_responses.find(r => r.key === week_commencing)

    let values = []
    if (bin_response && bin_response.values.length !== 0) {
      values = bin_response.values
    }
    binned_responses.push({
      key: step_date_formatted,
      values
    })
  }

  return binned_responses
}



export function spatial_bins({responses, options}) {
  // figure out, maybe through options, if the current 'filter/focus level' is the same as 'planning level'.
  // if not, need to match each response.location.id to something at the 'filter level'
  // then return, same as the other bins

  // split/bin into series
  console.log("🚨 JUST USING SIMPLE SPATIAL BINS")

  const binned_responses = nest()
    .key(f => get(f, options.bin_by))
    .sortKeys(ascending)
    .entries(responses)

  return binned_responses

}
