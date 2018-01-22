import {Parser} from 'expr-eval'
import isNumber from 'is-number'
import {get, has, cloneDeep} from 'lodash'
import {store} from 'apps/store'
import {get_denominator_enumerable_name} from 'lib/instance_data/spatial_hierarchy_helper'
import {get_planning_level_name} from "../../../instance_data/spatial_hierarchy_helper";

/**
 * For the given array of responses, will reduce to a single value
 * @param {array} responses
 * @param targets
 * @param aggregation {Aggregation Object}
 * @returns {number}
 */
export function aggregate_on({responses, targets, aggregation, previous_aggregations, options, bin}) {
  let numerator, denominator, result // because webpack

  // TODO: @refac Taking an array of aggregations might require fewer iterations of each response --> faster?
  if (!aggregation) throw new Error(`Missing aggregation`)

  if (aggregation.hasOwnProperty('numerator_expr') && aggregation.hasOwnProperty('denominator_field')) {
    // Calculate proportion
    try {
      numerator = calculate_numerator({responses, ...aggregation})
      denominator = calculate_denominator({responses, targets, options, aggregation, bin})
      result = numerator / denominator
      if (!isNumber(result)) return 0
      return result * 100
    } catch (e) {
      return 0
    }

  } else if (aggregation.hasOwnProperty('numerator_expr') && aggregation.hasOwnProperty('denominator_aggregation')) {
    // Calculate proportion
    try {
      numerator = calculate_numerator({responses, ...aggregation})
      if (!previous_aggregations.hasOwnProperty(aggregation.denominator_aggregation)) console.log(`Don't have dependent aggregation of "${aggregation.denominator_aggregation}" for "${aggregation.name}"`)

      denominator = previous_aggregations[aggregation.denominator_aggregation]

      result = numerator / denominator

      if (!isNumber(result)) {
        return 0
      }

      return result * 100
    } catch (e) {
      console.log(e)
      return 0
    }

  } else if (aggregation.hasOwnProperty('numerator_expr')) {
    // Calculate numerator only
    try {
      numerator = calculate_numerator({responses, ...aggregation, options})
      return numerator
    } catch (e) {
      console.log(e)
      return 0
    }
  }
}


function numerical_aggregator(responses, expression) {
  return responses.reduce((sum, {form_data}) => {

    const questions_answered = Object.keys(form_data)

    if (expression.variables().every(i => questions_answered.includes(i))) {

      const result = expression.evaluate(form_data)

      if (!isNumber(result)) return sum

      return sum + result
    } else {
      return sum
    }

  }, 0)
}

export function categorical_aggregator(responses, expression) {
  return responses.reduce((accumulator, {form_data}) => {

    const questions_answered = Object.keys(form_data)

    if (expression.variables().every(i => questions_answered.includes(i))) {
      // this will return the 'full' value (i.e. an array or object)
      const answer_array = expression.evaluate(form_data)

      for (const answer of answer_array) {
        if (accumulator.hasOwnProperty(answer)) {
          accumulator[answer] += 1
        } else {
          accumulator[answer] = 1
        }
      }
    }

    return accumulator
  }, {})
}

function calculate_numerator({responses, numerator_expr, filter}) {
  const options = {operators: {'in': true}}
  const expression = new Parser(options).parse(numerator_expr)

  if (filter) {
    const result = categorical_aggregator(responses, expression)
    return result[filter] || 0
  } else {
    return numerical_aggregator(responses, expression)
  }
}

function calculate_denominator({responses, targets, options, aggregation, bin}) {
  const spatial_filter = get(options, 'filters', []).filter(f => f.name.startsWith('location.selection'))[0]

  if (['table', 'map'].includes(options.chart_type)) {
    return other_filtered_targets({targets, bin})
  }

  if (spatial_filter) {
    return filtered_targets({targets, responses, options, spatial_filter, bin})
  }

  return sum_targets(targets)
}

function other_filtered_targets({targets, bin}) {
  const filtered_targets = targets.filter(t => t.id == bin.key)
  return sum_targets(filtered_targets)
}

function filtered_targets({targets, responses, options, spatial_filter, bin}) {
  const spatial_aggregation_level = options.spatial_aggregation_level
  const planning_level_name = get_planning_level_name()// e.g villages
  const location_selection_options = store.state.instance_config.location_selection[planning_level_name]

  // Calculate
  let shrunk_targets = cloneDeep(targets)

  if (!has(spatial_filter, 'name') || typeof spatial_filter.name !== 'string') throw new Error("Filter missing a name")
  if (!has(spatial_filter, 'value')) throw new Error("Filter missing a value")
  const spatial_filter_name = spatial_filter.name.split('.')[2]// get the last last part of the spatial filter, ie category or id
  const spatial_filter_value = spatial_filter.value

  const is_filtering_at_planning_level = spatial_filter_name === 'id'
  const is_aggregating_at_planning_level = spatial_aggregation_level === planning_level_name

  if (is_filtering_at_planning_level && is_aggregating_at_planning_level) {
    // Filter targets to only include targets with the target id in the filter
    shrunk_targets = targets.filter(t => t.id === spatial_filter_value)
  }

  if (is_filtering_at_planning_level && !is_aggregating_at_planning_level) {
    //Filter targets to only include targets for the districts the responses are in,
    if (responses.length === 0) {
      shrunk_targets = []
    } else {
      const category = get(responses[0], 'location.selection.category', null)
      shrunk_targets = targets.filter(t => t.id === category)
    }
  }

  if (!is_filtering_at_planning_level && is_aggregating_at_planning_level) {
    // Filter the targets to only include the targets under the category in the filter
    const ids = location_selection_options.filter(t => t.category === spatial_filter_value).map(t => t.id)
    shrunk_targets = targets.filter(t => ids.includes(t.id))
  }

  if (!is_filtering_at_planning_level && !is_aggregating_at_planning_level) {
    // Filter the targets where target.id is equal to the category from the filter
    shrunk_targets = targets.filter(t => t.id === spatial_filter_value)
  }

  return sum_targets(shrunk_targets)

}

function sum_targets(targets) {
  // Else should use total_target - ie. from all targets
  const enumerable_field = get_denominator_enumerable_name() // e.g. structures for NAM
  return targets
    .filter(t => t[enumerable_field])
    .reduce((acc, t) => {
      return acc + t[enumerable_field]
    }, 0)
}

function filter_targets({targets}) {

}

function aggregate_targets({targets}) {

}