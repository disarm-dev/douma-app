// TODO: @refac Move this into the instance_config schema (think it's mostly there)
// Help us get the right data out of instance configs

import schema from 'js-schema'

const denominator_units_schema = schema({
  physical: {
    id_field: String,
    enumerable: String
  },
  human: {
    id_field: String,
    enumerable: String
  }
})

const validate_schema_for = (type, instance_config) => {
  const found = instance_config.spatial_hierarchy.find(h => h.hasOwnProperty('denominator_units'))
  if (found) {
    const denominator_units = found.denominator_units
    if (denominator_units_schema(denominator_units) && denominator_units.hasOwnProperty(type)) {
      return denominator_units[type]
    } else {
      throw denominator_units_schema.errors(denominator_units)
    }
  }
  throw new Error(`${type} not found on denominator_units in instance_config`)
}

const physical_denominator = (instance_config) => {
  console.log(instance_config)
  return validate_schema_for('physical', instance_config)
}
const human_denominator = (instance_config) => {
  return validate_schema_for('human', instance_config)
}


export {physical_denominator, human_denominator}
