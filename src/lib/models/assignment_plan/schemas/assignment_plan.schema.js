import schema from 'js-schema'
import {AssignmentSchema} from './assignment.schema'

export const AssignmentPlanSchema = schema({
  assignments: Array.of_x(0, Infinity, AssignmentSchema),
  country: String,
})
