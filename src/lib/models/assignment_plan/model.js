import array_unique from 'array-unique'
import get from 'lodash.get'

import {AssignmentSchema} from './schemas/assignment.schema'
import {AssignmentPlanSchema} from './schemas/assignment_plan.schema'
import {DECORATED_UNASSIGNED_TEAM} from 'apps/irs_tasker/unassigned_team'

export class AssignmentPlan {

  create({assignments, country}) {
    if (!AssignmentPlanSchema({assignments, country})) {
      const errors = AssignmentPlanSchema.errors({assignments, country})
      throw new Error(`AssignmentPlan failed validation: ${JSON.stringify(errors)}`)
    }

    return {assignments, country}
  }

  load_from_json(assignment_plan_json, plan_target_ids) {
    // Create assignments for every plan target, including those not already assigned in a plan
    const previous_assignments = get(assignment_plan_json, 'assignments', [])

    const assignments = plan_target_ids.map(target_id => {
      const found_assignment = previous_assignments.find(a => a.area_id === target_id)
      if (found_assignment) {
        return found_assignment
      } else {
        return {area_id: target_id, team_name: DECORATED_UNASSIGNED_TEAM.team_name}
      }
    })

    const teams = array_unique(assignments.map(assignment => assignment.team_name)).filter(i => i)
    return {assignments, teams}
  }

  /**
   * Take a plan, extract target ids.
   * Also, create assignments by:
   * 1. removing any existing ones that are not in the current plan
   * 2. making empty assignments for new targets
   * @param plan_json
   * @param existing_assignments
   * @returns {*}
   */
  extract_target_ids_and_assignments_from_plan(plan_json, existing_assignments) {
    // Empty plan - no targets, so no assignments
    if (!plan_json.targets) return {assignments, plan_target_ids}

    // Get area_ids of new target areas
    const plan_target_ids = plan_json.targets.map(target => target.id)

    // Find only existing assignments within new plan
    const existing_assignments_within_plan = existing_assignments.filter(a => {
      return plan_target_ids.includes(a.area_id)
    })

    // Create assignments for each target area
    const assignments = plan_target_ids.map(area_id => {
      const existing_assignment = existing_assignments_within_plan.find(a => a.area_id === area_id)

      if (existing_assignment) {
        return existing_assignment
      } else {
        // Make a new, empty assignment
        return {area_id, team_name: DECORATED_UNASSIGNED_TEAM.team_name}
      }
    }).filter(i => i)

    return {assignments, plan_target_ids}
  }
}
