import schema from 'js-schema'

export const TargetSchema = schema({
  id: [String, Number], // this is e.g. AggUniCode for SWZ
  '?assigned_to_team_name': [String, null], // 'Team 1' // TODO: @remove this schema requirement
  '?number_of_structures': [Number, null],
  '?number_of_households': [Number, null]
})
