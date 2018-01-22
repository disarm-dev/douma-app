import {nest} from 'd3-collection'
import isNumber from 'is-number'
import {cloneDeep} from 'lodash'

import {
  get_all_spatial_hierarchy_levels, get_denominator_enumerable_name, get_denominator_fields,
  get_planning_level_name
} from "lib/instance_data/spatial_hierarchy_helper"
import cache from "config/cache"


export function get_targets(targets, spatial_aggregation_level) {
  const planning_level_name = get_planning_level_name()

  if (spatial_aggregation_level === planning_level_name) {
    // Spatial aggregation level is the same as the planning_level so we return the targets
    return targets
  }

  targets = cloneDeep(targets)

  const decorated_targets = decorate_targets(targets)
  const binned_targets = get_binned_targets(decorated_targets)
  const aggregated_targets = get_aggregated_targets(binned_targets)

  decorate_target_level_with_denominator(aggregated_targets, spatial_aggregation_level)

  return aggregated_targets
}

function decorate_targets(targets) {
  const planning_level_name = get_planning_level_name()
  const levels = get_all_spatial_hierarchy_levels()
  const planning_level = levels.find(l => l.name === planning_level_name)

  const category_field = planning_level.group_by_field

  // Find out which level above each target is in
  // Find the planning_level feature and get the category from that
  // get planning_level.group_by_field of each

  const decorated_targets = targets.map(t => {
    const features = cache.geodata[planning_level_name].features
    const feature = features.find(feature => {
      return feature.properties.__disarm_geo_id == t.id
    })

    if (feature) {
      t.category = feature.properties[category_field]
    }

    return t
  })

  return decorated_targets
}

function get_binned_targets (targets) {
  const binned_targets = nest()
    .key(t => t.category)
    .entries(targets)

  return binned_targets
}


function get_aggregated_targets(binned_targets) {
  const denominator_enumerable_name = get_denominator_enumerable_name()
  const aggregated_targets = []

  for (const bin of binned_targets) {
    const new_denominator = bin.values.reduce((sum, target) => {
      const value = target[denominator_enumerable_name]

      if (isNumber(value)) {
        return sum + value
      } else {
        return sum
      }
    }, 0)

    const new_target = {
      id: bin.key,
      [denominator_enumerable_name]: new_denominator
    }

    aggregated_targets.push(new_target)
  }

  return aggregated_targets
}

function decorate_target_level_with_denominator(aggregated_targets, spatial_aggregation_level) {
  const denominator_enumerable_name = get_denominator_enumerable_name()
  const denominator_fields = get_denominator_fields()
  const enumerable_field_name = denominator_fields[denominator_enumerable_name]

  cache.geodata[spatial_aggregation_level].features.forEach(feature => {
    const target = aggregated_targets.find(t => t.id === feature.properties.__disarm_geo_name)
    if (target) {
      feature.properties[enumerable_field_name] = target[denominator_enumerable_name]
    }
  })

}
