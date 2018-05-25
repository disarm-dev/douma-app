import {get} from 'lodash'

import {LogValueConvertor} from 'lib/helpers/log_helper'
import {layer_definitions} from 'config/map_layers'
import {prepare_palette} from 'lib/helpers/palette_helper'

/**
 * Add scaled/normalised risk to each feature
 * @param features: definitely some features
 * @param risk_scaler: no idea
 */
export function decorate_with_risk(features, risk_scaler) {
  const values_array = features.map(feature => feature.properties.risk).sort().filter(i => i)
  risk_scaler = new LogValueConvertor(values_array)

  const attribute = layer_definitions.normalised_risk.attribute
  return features.map((feature) => {
    feature.properties[attribute] = risk_scaler.lval(feature.properties.risk)
    return feature
  })
}

export function entries_for_legend (selected_layer, risk_scaler) {
  const layer_definition = get(layer_definitions, selected_layer, layer_definitions['default_palette'])
  const palette = prepare_palette(layer_definition)

  return palette.map((array) => {
    if (selected_layer === 'normalised_risk' && risk_scaler) {
      const value = risk_scaler.value(array[0])
      array[0] = numeral(value).format('0.[00]')
    }

    return {
      text: array[0],
      colour: array[1]
    }
  })

}