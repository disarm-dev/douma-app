import Vue from 'vue'
import { isEqual, get } from 'lodash'

import { set_filter, unset_filter } from './pages/controls/filters/controller'
import CONFIG from 'config/common'


export default {
  namespaced: true,
  state: {
    ui: {},
    last_id: null, // ObjectID of most recently synced response, should be kept in store for persistence
    filter: null,
    map_options: {
      show_response_points: true,
      selected_layer: 'normalised_risk'
    },
    show_filters: false,
    responses_last_updated_at: null,
    dashboard_options: {
      // TODO: @config Extract default temporal_aggregation_level
      temporal_aggregation_level: CONFIG.applets.irs_monitor.defaults.temporal_aggregation_level,
      spatial_aggregation_level: null,
      limit_to_plan: true,
      limit_to: ''
    },

    // Probably data
   // plan: null,
   // plans: [],
    filters: [],
  //  responses: [],
    guess_selection_ids: {} //Is this used?
  },
  mutations: {
    // clear storage (called by meta store)
    clear_data_storage: (state) => {
     // state.responses = [] // TODO: Remove
      state.responses_last_updated_at = null
      state.filters = []
    },
    update_responses_last_updated_at: (state) => {
      state.responses_last_updated_at = new Date
    },
    // set plan
    /*set_plan: (state, plan) => {
      state.plan = plan
    },
    set_all_plans: (state, plans) => {
      state.plans = plans
    },*/
    set_filter: (state, { filter_name, filter_object }) => {
      const new_filters = set_filter(state.filters, filter_name, filter_object)
      state.filters = new_filters
    },
    add_filter: (state, field_filter) => {

      const filter_present = state.filters.some(f => isEqual(f, field_filter))
      if (filter_present) return

      // we replace temporal filters with the same comparator
      if (field_filter.name === 'recorded_on') {
        const filter_index = state.filters.findIndex(f => isEqual(f.name, field_filter.name) && isEqual(f.comparator, field_filter.comparator))
        if (filter_index >= 0) {
          state.filters.splice(filter_index, 1, field_filter)
          return
        }
      }

      state.filters.push(field_filter)
    },
    remove_filter: (state, field_filter) => {
      const index = state.filters.findIndex(filter => isEqual(filter, field_filter))
      state.filters.splice(index, 1)
    },
    set_show_filters: (state, value) => {
      state.show_filters = value
    },
    set_ui: (state, ui) => {
      state.ui = ui
    },
    set_dashboard_options: (state, options) => {
      state.dashboard_options = options
    },
    set_dashboard_option: (state, { key, value }) => {
      Vue.set(state.dashboard_options, key, value)
    },
    set_selected_layer(state, selected_layer) {
      state.map_options.selected_layer = selected_layer
    },
    set_show_response_points(state, show_response_points) {
      state.map_options.show_response_points = show_response_points
    },
    set_last_id(state, last_id) {
      state.last_id = last_id
    }
  },
  // TODO: Re-remove everything under here.
  getters: {
    // Return all the targets from the plan
    // targets(state, getters) {
    //   if (!state.plan) return []
    //
    //   const spatial_aggregation_level = state.dashboard_options.spatial_aggregation_level
    //   return get_targets(state.plan.targets, spatial_aggregation_level)
    // },

   /* plan_target_area_ids(state) {
      if (state.plan && state.plan.targets) {
        return state.plan.targets.map(target => target.id)
      } else {
        return []
      }
    },


    // Responses which are contained by current plan
    // ideally, filtered_responses should change in response to the
    // settings of the filter e.g. "locality #2"
    filtered_responses(state, getters, rootState) {
      if (!state.responses.length) return []

      // limit to plan if 'dashboard_options.limit_to_plan' is true
      const limited_to_plan = state.responses.filter(r => {
        if (!state.dashboard_options.limit_to_plan) return true

        const id = get(r, 'location.selection.id', false)
        if (id) {
          return getters.plan_target_area_ids.includes(id)
        } else {
          return false
        }
      })

      const filtered = filter_responses(limited_to_plan, state.filters)

      return filtered
    },*/

  },
  actions: {
  /*  get_responses_local: (context) => {
      const personalised_instance_id = context.rootState.meta.personalised_instance_id
      const instance = context.rootState.instance_config.instance.slug
      return response_controller.read_all_cache({ personalised_instance_id, instance }).then(responses => {
        context.commit('set_responses', responses)
      })
    },
    get_all_records: async(context) => {
      const last_id = context.state.last_id
      if (last_id == null) {
        store.commit('irs_record_point/clear_responses_not_inVillage')
        store.commit('irs_record_point/clear_guessed_responses')
      }
      const responses = await response_controller.read_new_network_write_local(last_id)

      if (responses.length) {
        const updated_last_id = responses[responses.length - 1]._id
        context.commit('set_last_id', updated_last_id)
        context.commit('root:set_snackbar', { message: 'Retrieving more records.' }, { root: true })
        context.commit('update_responses_last_updated_at')
        return context.dispatch('get_all_records')
      } else {
        context.commit('root:set_snackbar', { message: 'Completed retrieving records. Updated map, table, charts.' }, { root: true })
        return context.dispatch('get_responses_local')
      }

    },
   /* get_current_plan: (context) => {
      return plan_controller.read_plan_current_network()
        .then(plan_json => {
          if (Object.keys(plan_json).length === 0) {
            return context.commit('root:set_snackbar', { message: 'No plan loaded.' }, { root: true })
          }

          try {
            new Plan().validate(plan_json)
            context.commit('set_plan', plan_json)
          } catch (e) {
            console.log(e)
          }
        })
    }

    load_all_plans: (context) => {
      return plan_controller.read_plans()
        .then(plans => {
          context.commit('set_all_plans', plans)
        })
    },
    get_network_plan_detail: (context, plan_id) => {
      return plan_controller.read_plan_detail_network(plan_id).then(plan_json => {
        if (Object.keys(plan_json).length === 0) {
          return context.commit('root:set_snackbar', { message: 'There is no remote plan. Please create one.' }, { root: true })
        }

        try {
          new Plan().validate(plan_json)

          let target_areas = plan_json.targets.map(area => {
            return area.id
          })

          context.commit('set_plan', plan_json)
            //TODO: Load responses for this plan
        } catch (e) {
          console.error(e)
          context.commit('root:set_snackbar', { message: 'ERROR: Plan is not valid' }, { root: true })
        }

      })
    },
    get_network_plan_list: (context) => {
      return plan_controller.read_plan_list_network().then(plan_json => {
        if (Object.keys(plan_json).length === 0) {
          return context.commit('root:set_snackbar', { message: 'There is no remote plan. Please create one.' }, { root: true })
        }
        context.commit('set_all_plans', plan_json)
        return plan_json
      })
    }*/
  }
}
