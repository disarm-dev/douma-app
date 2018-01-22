import without from 'lodash.without'

import {AssignmentPlan} from 'lib/models/assignment_plan/model'
import {DECORATED_UNASSIGNED_TEAM} from 'apps/irs_tasker/unassigned_team'
import {PlanController} from 'lib/models/plan/controller'
import {read_assignment_plan, create_assignment_plan} from 'lib/models/assignment_plan/remote'

const controller = new PlanController('irs_tasker')

export default {
  namespaced: true,
  unpersisted_state_keys: [],
  state: {
    teams: [], // This is an array of team_names
    assignments: [], // Array of {area_id, team_name}
    selected_team_name: null,

    plan_target_ids: [],
    unsynced_changes: false,
  },
  mutations: {
    set_selected_team_name: (state, selected_team_name) => {
      state.selected_team_name = selected_team_name
    },
    clear_data_storage:(state) => {
      state.teams = []
      state.assignments = []
      state.selected_team_name = null
      state.plan_target_ids = []
      state.unsynced_changes = false
    },
    "set_teams": (state, teams) => {
      state.teams = teams.filter(t => t !== DECORATED_UNASSIGNED_TEAM.team_name)
    },
    "set_assignment": (state, {area_id, team_name}) => {
      const assignment_index = state.assignments.findIndex(a => a.area_id === area_id)
      const assignment = state.assignments[assignment_index]
      // splice it into place
      assignment.team_name = team_name
      state.assignments.splice(assignment_index, 1, assignment)
    },
    "set_assignments": (state, assignments) => {
      state.assignments = assignments
    },
    'set_plan_target_ids': (state, plan_target_ids) => {
      state.plan_target_ids = plan_target_ids
    },
    'set_unsynced_changes': (state, unsynced_changes) => {
      state.unsynced_changes = unsynced_changes
    }
  },
  actions: {
    'update_teams': (context, teams) => {
      context.commit('set_teams', teams)
      context.commit('set_unsynced_changes',true)

    },
    'assign_area_to_team': (context, {area_id, team_name}) => {
      context.commit('set_assignment', {area_id, team_name})
      context.commit('set_unsynced_changes',true)
    },
    'delete_team': (context, team_name) => {
      context.state.assignments.forEach(assignment => {
        if (assignment.team_name === team_name) {
          context.commit('set_assignment', {area_id: assignment.area_id, team_name: DECORATED_UNASSIGNED_TEAM.team_name})
        }
      })

      const teams_without = without(context.state.teams, team_name)
      context.commit('set_teams', teams_without)
      context.commit('set_unsynced_changes',true)
    },
    'get_current_plan': (context) => {
      return controller.read_plan_current_network().then((plan_json) => {
        const existing_assignments = context.state.assignments
        const {assignments, plan_target_ids} = new AssignmentPlan().extract_target_ids_and_assignments_from_plan(plan_json, existing_assignments)

        if (plan_target_ids.length) {
          context.commit('set_assignments', assignments)
          context.commit('set_plan_target_ids', plan_target_ids)
        } else {
          context.commit('root:set_snackbar', {message: 'No plan found'}, {root: true})
        }
      })
    },
    'load_assignment_plan': (context) => {
      return read_assignment_plan().then(assignment_plan_json => {
        const plan_target_ids = context.state.plan_target_ids
        const {assignments, teams} = new AssignmentPlan().load_from_json(assignment_plan_json, plan_target_ids)
        context.commit('set_assignments', assignments)
        context.commit('set_teams', teams)
        context.commit('set_unsynced_changes',false)
      })
    },
    'save_assignment_plan': (context) => {
      const assignment_plan_content = {
        assignments: context.state.assignments,
        country: context.rootState.instance_config.instance.slug
      }

      const assignment_plan = new AssignmentPlan().create(assignment_plan_content)

      return create_assignment_plan(assignment_plan).then(() => {
        context.commit('set_unsynced_changes', false)
        context.commit('root:set_snackbar', {message: 'Assignment Plan saved'}, {root: true})
      })
    }
  }
}
