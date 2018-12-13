import Raven from 'raven-js'
import {get} from 'lodash'
import unique from 'array-unique'

import {authenticate} from 'lib/models/user'
import {decorate_applets} from 'lib/instance_data/decorated_applets'
import {User} from 'lib/models/user/model'
import {set_raven_user_context} from 'config/error_tracking.js'
import {setup_acl} from "lib/acess-control-list"

export default {
  namespaced: true,
  unpersisted_state_keys: [],
  state: {
    user: null,
    previous_route: '',
    personalised_instance_id: 'default',
    configurations: []
  },
  mutations: {
    set_previous_route: (state, previous_route) => {
      state.previous_route = previous_route
    },
    set_user: (state, user) => {
      state.user = user
    },
    set_personalised_instance_id: (state, personalised_instance_id) => {
      state.personalised_instance_id = personalised_instance_id || 'default'
    },
    set_configurations(state, configurations) {
      state.configurations = configurations
    }
  },
  getters: {
    decorated_applets(state, getters, rootState) {
      // Figure out which applets are allowed, and only decorate and show these!
      if (!state.user) return []
      if (!state.user.permissions) return []

      const list_of_applets = state.user.permissions.map(p => p.replace('write:', '').replace('read:', ''))
      const user_allowed_applets = unique(list_of_applets)
      const instance_applets = rootState.instance_config.applets

      return decorate_applets({user_allowed_applets, instance_applets})
    }
  },
  actions: {
    logout: (context) => {
      Raven.setUserContext({})

      // This is the actual log-out side-effect. No `user` means router goes to login
      context.commit('set_user', null)

      console.log('TODO: remove instance_config from store')
    },
    clear_data_storage: (context, {instance_id_changed, authenticated_user}) => {
      if (!instance_id_changed) return // Nothing changed

      const applets = get(authenticated_user, 'allowed_apps.read', [])
      applets.forEach(applet => {
        const mutation  = `${applet}/clear_data_storage`
        context.commit(mutation, {}, {root: true})
      })
      console.warn('Instance changed. Local data storage cleared for:', applets.join(', '))
    },
  }
}
