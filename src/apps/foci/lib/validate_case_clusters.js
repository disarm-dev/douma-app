import Ajv from 'ajv'
import { case_cluster_schema } from './models/case_clusters/schema'
import { case_schema } from './models/cases/schema'

const ajv = new Ajv()

export function validate_case_clusters(case_clusters) {
  for (const case_cluster of case_clusters) {
    if (!ajv.validate(case_cluster_schema, case_cluster)) {
      throw ajv.errors
    }
  }
}

export function validate_cases(cases) {
  for (const single_case of cases) {
    if (!ajv.validate(case_schema, single_case)) {
      throw ajv.errors
    }
  }
}