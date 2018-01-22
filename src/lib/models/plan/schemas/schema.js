import schema from 'js-schema'

import {TargetSchema} from './target.schema.js'

export const PlanSchema = schema({
  focus_filter_area: [Object, null],
  country: String, // e.g. 'swz'
  targets: Array.of_x(0, Infinity, TargetSchema)
})
