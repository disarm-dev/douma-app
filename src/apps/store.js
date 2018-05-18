import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

let store
export { store }

export function create_store(instance_config, instance_stores) {
  // location_selection is big, don't want to store in state.
  // TODO: instance_config should not be in $store
  delete instance_config.location_selection

  store = new Vuex.Store({
    modules: instance_stores,
    plugins: [createPersistedState()],
    state: {
      // Global config
      instance_config: instance_config,

      // Global UI
      snackbar: { message: null },
      sw_message: { message: null, title: null },
      sw_update_available: false,
      network_online: false,

      // Irrelevant values: only watched for changes
      trigger_help_visible_irrelevant_value: false, // Beware - don't care whether it true or false, just that it changes

    },
    mutations: {
      'root:set_instance_config': (state, instance_config) => {
        state.instance_config = instance_config
      },
      'root:set_snackbar': (state, snackbar) => {
        state.snackbar = snackbar // Need to have a {message: "Like this"}
      },
      'root:set_sw_message': (state, sw_message) => {
        state.sw_message = sw_message // Need to have {title: 'title', and message: 'message'}
      },
      'root:set_sw_update_available': (state, sw_update_available) => {
        state.sw_update_available = sw_update_available
      },
      'root:network_online': (state, is_online) => {
        state.network_online = is_online
      },
      'root:trigger_help_visible': (state) => {
        state.trigger_help_visible_irrelevant_value = !state.trigger_help_visible_irrelevant_value
      }
    },
  })

  return store
}