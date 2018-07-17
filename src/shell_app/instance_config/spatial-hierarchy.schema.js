import schema from 'js-schema'

export const SpatialHierarchySchema = schema({
  field_name: String,
  name: String,
  '?group_by_level': String, // Used for creating location_selection
  '?group_by_field': String, // Used for creating location_selection
})
