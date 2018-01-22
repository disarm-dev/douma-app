import cache from "config/cache"
import {aggregate_on} from "lib/models/response/aggregations/aggregator"
import flow from "lodash/fp/flow"
import map from "lodash/fp/map"
import compact from "lodash/fp/compact"
import {featureCollection} from "@turf/helpers"
import {get_planning_level_name} from "lib/instance_data/spatial_hierarchy_helper"

/**
 *
 * @param binned_responses
 * @param targets
 * @param {string[]} options.aggregations - list of aggregation_names to use to calculate aggregations
 * @param {object[]} aggregations - array of Aggregations
 * @returns {{}}
 */
export function decorate_geodata({binned_responses, targets, aggregations, options}) {
  const selected_geodata_level_fc = cache.geodata[options.spatial_aggregation_level]
  // collect the aggregations from options.aggregation_names
  const aggregations_for_map = options.aggregation_names.map(string => {
    const found = aggregations.find(aggregation => aggregation.name === string)

    if (!found) console.warn(`Missing aggregation for ${string}`)
    return found
  })

  // calculate all aggregations for responses in each bin
  const spatially_binned_aggregations = binned_responses.map(bin => {

    let result = {key: bin.key, values: {}}
    let previous_aggregations = {}
    aggregations_for_map.forEach(aggregation => {
      const value = aggregate_on({aggregation, responses: bin.values, targets, previous_aggregations, options, bin})
      previous_aggregations[aggregation.name] = value
      result.values[aggregation.name] = value
    })
    return result
  }) // e.g. [{key: 'Tutume', values: {'% sprayed': 10}}, {key: 'Chobe', values: {'% sprayed': 20}}]

  const planning_level_name = get_planning_level_name()
  const location_grouping_field =  options.spatial_aggregation_level === planning_level_name ? '__disarm_geo_id' : '__disarm_geo_name'

  // create featureCollection, matching geodata with response bins
  const decorated_features = flow(
    map((geodata_feature) => {

      const found_bin = spatially_binned_aggregations.find((bin) => {
        return bin.key === String(geodata_feature.properties[location_grouping_field])
      })

      if (found_bin) {
        geodata_feature.properties = {
          ...geodata_feature.properties,
          ...found_bin.values
        }
      } else {
        // Decorate the feature with the aggregations and set values to 0

        const empty_aggregations = aggregations_for_map.reduce((acc, aggregation) => {
          acc[aggregation.name] = 0
          return acc
        }, {})

        geodata_feature.properties = {
          ...geodata_feature.properties,
          ...empty_aggregations
        }
      }

      return geodata_feature
    }),
    compact
  )(selected_geodata_level_fc.features)


  // return a featureCollection
  return featureCollection(decorated_features)
}