import schema from 'js-schema'

import {CoordsSchema} from './coords.schema'
import {SelectionSchema} from './selection.schema'

export const ResponseSchema = schema({
  // passed-in, non-editable
  instance_slug: String,

  // generated, non-editable
  userAgent: String,
  id: String,

  // passed-in, editable
  username: String,
  '?user_id': String, // TODO: @refac Make required, and make username optional (or remove it!)
  team_name: [String, null],

  // generated, editable
  recorded_on: [String, Date],

  // user-generated, editable
  team_name: [String, null],
  form_data: [Object, null],
  location:  {
    coords: [CoordsSchema, null],
    selection: [SelectionSchema, null]
  }
})


