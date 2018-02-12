import Ajv from 'ajv'
import { case_cluster_schema } from './models/case_clusters/schema'
import { case_schema } from './models/cases/schema'

const ajv = new Ajv()
const case_cluster_validate = ajv.compile(case_cluster_schema);
const case_validate = ajv.compile(case_schema);

export function validate_case_clusters(case_clusters) {
  for (const case_cluster of case_clusters) {
    if (!case_cluster_validate(case_cluster)) {
      throw case_cluster_validate.errors
    }
  }
}

export function validate_cases(cases) {
  for (const single_case of cases) {
    if (!case_validate(single_case)) {
      throw case_validate.errors
    }
  }
}