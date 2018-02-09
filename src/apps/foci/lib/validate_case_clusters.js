import Ajv from 'ajv'
import { case_cluster_schema } from './models/case_clusters/schema'

const ajv = new Ajv()

export function validate_case_clusters(case_clusters) {
    for (const case_cluster of case_clusters) {
        if (!ajv.validate(case_cluster_schema, case_cluster)) {
            throw ajv.errors
        }
    }
}