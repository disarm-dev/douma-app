import schema from 'js-schema'

const applet_base_schema = {
  '?title': String,
  '?icon': String,
}

const IrsMonitorSchema = schema({
  ...applet_base_schema,
  map: Object,
  table: Object,
  '?charts': Array.of_x(1, Infinity, {
    id: String,
    style: {
      height_constraint: ['none', 'viewport'],
      width_constraint: ['half', 'full']
    }
  })
})

const IrsPlanSchema = schema({
  ...applet_base_schema,
  // default_planning_level: String // One of the spatial_hierarchy `name` fields
})

const IrsRecordPointSchema = schema({...applet_base_schema})

const IrsTaskerSchema = schema({...applet_base_schema})

const MetaSchema = schema({...applet_base_schema})

export const AppletsSchema = schema({
  '?irs_monitor': IrsMonitorSchema,
  '?irs_plan': IrsPlanSchema,
  '?irs_record_point': IrsRecordPointSchema,
  '?irs_tasker': IrsTaskerSchema,
  meta: MetaSchema
})

