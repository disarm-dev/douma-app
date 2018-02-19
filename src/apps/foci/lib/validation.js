import Ajv from 'ajv'
import { case_cluster_schema } from './models/case_clusters/schema'
import { case_location_schema } from './models/case_locations/schema'
import geometry_schema from './geometry_schema'

const ajv = new Ajv()
ajv.addSchema(geometry_schema)

const case_cluster_validate = ajv.compile(case_cluster_schema);
const case_location_validate = ajv.compile(case_location_schema);

export function validate_case_clusters(case_clusters) {
  for (const case_cluster of case_clusters) {
    if (!case_cluster_validate(case_cluster)) {
      throw case_cluster_validate.errors
    }
  }
}

export function validate_case_locations(case_locations) {
  for (const case_location of case_locations) {
    if (!case_location_validate(case_location)) {
      throw case_location_validate.errors
    }
  }
}