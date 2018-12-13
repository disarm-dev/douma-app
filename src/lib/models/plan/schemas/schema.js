import schema from 'js-schema'

import {TargetSchema} from './target.schema.js'

export const PlanSchema = schema({
  instance_id: String,
  focus_filter_area: [Object, null],
  name:String,
  targets: Array.of_x(0, Infinity, TargetSchema)
})
