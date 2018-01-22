import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'
import { createVuexLoader } from 'vuex-loading'

import {generate_persisted_state_options} from 'config/vuex-persistedstate_options'
import CONFIG from 'config/common'

let store
export {store}

export function create_store(instance_config, instance_stores) {
  // use vuex
  Vue.use(Vuex)

  // vuex-loader
  const VuexLoading = createVuexLoader(CONFIG.vuex_loader_options)
  Vue.use(VuexLoading)

  // Generate config (reducer, etc) for vuex-persistedstate
  // This includes the paths for unpersisted state for large data objects
  const persisted_state_options = generate_persisted_state_options(instance_stores)

  store = new Vuex.Store({
    modules: instance_stores,
    plugins: [createPersistedState(persisted_state_options), VuexLoading.Store],
    state: {
      // Global config
      instance_config: instance_config, // Really important, should maybe be somewhere else

      // Global UI
      snackbar: {message: null},
      sw_message: {message: null, title: null},
      sw_update_available: false,
      network_online: false,

      // Irrelevant values: only watched for changes
      trigger_sidebar_visible_irrelevant_value: false,
      trigger_help_visible_irrelevant_value: false, // Beware - don't care whether it true or false, just that it changes

    },
    mutations: {
      'root:set_snackbar': (state, snackbar) => {
        state.snackbar = snackbar // Need to have a {message: "Like this"}
      },
      'root:set_sw_message': (state, sw_message) => {
        state.sw_message = sw_message // Need to have {title: 'title', and message: 'message'}
      },
      'root:set_sw_update_available': (state, sw_update_available) => {
        state.sw_update_available = sw_update_available
      },
      'root:set_instance_config': (state, instance_config) => {
        state.instance_config = instance_config
      },
      'root:network_online': (state, is_online) => {
        state.network_online = is_online
      },
      'root:trigger_help_visible': (state) => {
        state.trigger_help_visible_irrelevant_value = !state.trigger_help_visible_irrelevant_value
      },
      'root:toggle_sidebar': (state) => {
        state.trigger_sidebar_visible_irrelevant_value= !state.trigger_sidebar_visible_irrelevant_value
      },
    },
  })

  return store
}

