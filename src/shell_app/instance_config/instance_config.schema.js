// Schema for the raw `instance_config.json` file, not the one with `form` and `location_selection` added

import schema from 'js-schema'
import {AppletsSchema} from './applets.schema'
import {SpatialHierarchySchema} from './spatial-hierarchy.schema'

export const IncomingInstanceConfigSchema = schema({
  applets: AppletsSchema,
  map_focus: {
    centre: {
      lat: Number,
      lng: Number
    },
    zoom: Number
  },
  instance: {
    title: String,
    location_name: String,
    slug: String,
  },
  spatial_hierarchy: {
    '?data_version': Number, // TODO: @refac Make 'data_version' a required property on instance_config
    markers: {
      planning_level_name: String,
      record_location_selection_level_name: String,
      denominator_fields: Object
    },
    levels: Array.of_x(1, Infinity, SpatialHierarchySchema),
  }
  // TODO: @fix Don't currently have a way to validate the denominator on spatial_hierarchy - could do as separate property
  // denominator_units: {
  //   physical: {
  //     id_field: String, // e.g. number_of_structures
  //     enumerable: String // e.g "structure"
  //   },
  //   human: {
  //     id_field: String,
  //     enumerable: String
  //   },
  // },
})
