import array_unique from 'array-unique'

import {Plan} from 'lib/models/plan/model'
import {get_next_level_up_from_planning_level} from 'lib/instance_data/spatial_hierarchy_helper'
import cache from 'config/cache'
import {geodata_in_cache_and_valid} from 'lib/models/geodata/geodata.valid'
import {PlanController} from 'lib/models/plan/controller'

const controller = new PlanController('plan')

export default {
  namespaced: true,
  unpersisted_state_keys: [],
  state: {
    // Actual data
    current_plan: null, // Instance of plan model

    // Kind of data
    areas_included_by_click: [],
    areas_excluded_by_click: [],
    bulk_selected_ids: [],

    // Map
    selected_filter_area_option: null,

    // UI
    unsaved_changes: false,
    show_lowest_spatial_level: true // i.e. clusters but not clusters
  },
  getters: {
    'all_selected_area_ids': (state) => {
      const bulk_selected_ids = state.bulk_selected_ids

      // add included by click
      let result = bulk_selected_ids.concat(state.areas_included_by_click)

      // remove excluded by click
      state.areas_excluded_by_click.forEach(area_id => {
        const index = result.findIndex(i => i === area_id)
        if (index !== -1) {
          result.splice(index, 1)
        }
      })
      return result
    },
    'selected_filter_area': (state, getters, rootState) => {
      if (!state.selected_filter_area_option) return null

      if (!geodata_in_cache_and_valid()) {
        console.warn("Dangerously returning while we're building geodata from indexeddb: cache not loading.")
        return null
      }

      const level = get_next_level_up_from_planning_level()

      return cache.geodata[level.name].features.find(feature => {
        return feature.properties[level.field_name] === state.selected_filter_area_option.id
      })

    }
  },
  mutations: {
    set_show_lowest_spatial_level: (state, show_lowest_spatial_level) => {
      state.show_lowest_spatial_level = show_lowest_spatial_level
    },
    clear_data_storage:(state) => {
      state.current_plan = null
      state.areas_included_by_click = []
      state.areas_excluded_by_click = []
      state.bulk_selected_ids = []
      state.selected_filter_area_option = null
      state.unsaved_changes = false
    },
    "toggle_selected_target_area_id": (state, target_area_id) => {
      if (Array.isArray(target_area_id)) target_area_id = target_area_id[0]

      if (state.areas_included_by_click.includes(target_area_id)) {
        // remove target area from included

        let index = state.areas_included_by_click.findIndex((r) => r === target_area_id)
        state.areas_included_by_click.splice(index, 1)

      } else if (state.areas_excluded_by_click.includes(target_area_id)) {
        // remove target area from excluded
        let index = state.areas_excluded_by_click.findIndex((r) => r === target_area_id)
        state.areas_excluded_by_click.splice(index, 1)


      } else if (state.bulk_selected_ids.includes(target_area_id)){
        // add to excluded by click
        state.areas_excluded_by_click.push(target_area_id)

      } else if (!state.bulk_selected_ids.includes(target_area_id)) {
        // add to included by click
        state.areas_included_by_click.push(target_area_id)

      } else {
        console.log('💥should never see this - might be a feature outside a filtered_area')
      }

      state.unsaved_changes = true
    },
    'set_bulk_selected_ids': (state, selected_target_area_ids) => {
      state.bulk_selected_ids = selected_target_area_ids
      state.unsaved_changes = true
    },
    'add_selected_target_areas': (state, selected_target_area_ids) => {
      let temp_array = state.bulk_selected_ids.concat(selected_target_area_ids)
      let unique = array_unique(temp_array).filter(i => i)

      state.bulk_selected_ids = unique
      state.unsaved_changes = true
    },
    'set_unsaved_changes': (state, unsaved_changes) => {
      state.unsaved_changes = unsaved_changes
    },
    'clear_plan': (state) => {
      state.areas_included_by_click = []
      state.areas_excluded_by_click = []
      state.bulk_selected_ids = []
      state.current_plan = null
      state.unsaved_changes = false
    },
    'set_plan': (state, plan) => {
      state.current_plan = plan
    },
    'set_selected_filter_area_option': (state, id) => {
      state.selected_filter_area_option = id
    }
  },
  actions: {
    'save_plan': (context, plan) => {
      return controller.create_plan(plan)
        .then(() => {
          context.commit('set_plan', plan)
          context.commit('set_unsaved_changes', false)
        })
    },
    'get_network_plan': (context) => {
      return controller.read_plan_current_network().then(plan_json => {
        if (Object.keys(plan_json).length === 0) {
          return context.commit('root:set_snackbar', {message: 'There is no remote plan. Please create one.'}, {root: true})
        }

        try {
          new Plan().validate(plan_json)

          let target_areas = plan_json.targets.map(area => {
            return area.id
          })

          context.commit('clear_plan')
          context.commit('set_plan', plan_json)
          context.commit('add_selected_target_areas', target_areas)
          context.commit('set_unsaved_changes', false)
        } catch (e) {
          console.error(e)
          context.commit('root:set_snackbar', {message: 'ERROR: Plan is not valid'}, {root: true})
        }

      })
    }
  }
}
