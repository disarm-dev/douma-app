import schema from 'js-schema'

export const SelectionSchema = schema({
  // id is optional, as the custom text input only uses the name property
  // this is to distinguish between free text entry and something from location_selection
  '?id': [Number, String],
  name: String
})
