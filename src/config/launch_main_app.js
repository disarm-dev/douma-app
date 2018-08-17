import Vue from 'vue'

import VueLoading from 'vuex-loading'

import get from 'lodash.get'

import DoumaComponent from 'components/app.vue'
import { create_router } from '../apps/router'
import { create_store } from '../apps/store'
import { get_instance_stores_and_routes } from './applet_stores_and_routes'
import { configure_theme } from './theme'
import { instantiate_analytics, set_common_analytics } from 'config/analytics'
import { configure_spatial_helpers } from 'lib/instance_data/spatial_hierarchy_helper'
import { add_network_status_watcher } from 'lib/helpers/network_status.js'
import { check_need_to_update } from 'lib/remote/check-application-version'
import { set_raven_user_context } from 'config/error_tracking.js'
import { clean_up_local_dbs } from 'lib/local_db'
import { setup_acl } from 'lib/acess-control-list'
import { hydrate_geodata_cache_from_idb } from 'lib/models/geodata/local.geodata_store'
import {configure_pubsubcache_listeners} from 'config/configure_pubsubcache_listeners'

import BUILD_TIME from 'config/build-time'
import {hide_loading_page} from 'config/hide_loading_page'
import {remove_app} from 'config/remove_app'
import {remove_shell_app} from '../shell_app/launch_shell_app'

/**
 * Build a 'douma_app' instance
 * @param instance_config
 * @returns {Vue}
 */
let douma_app

export async function launch_main_app({ instance_config, user, personalised_instance_id}) {


  /////////////////////////////
  //
  // BEFORE router or store
  //
  /////////////////////////////

  // Set page title
  const title = get(instance_config, 'instance.title', '')
  document.title = `DiSARM ${title}`

  // Configure spatial_helpers to use instance_config
  // We need to do this before we create the store, the store relies on some of the function in spatial_hierarchy_helpers
  configure_spatial_helpers(instance_config)


  /////////////////////////////
  //
  // CREATE router and store
  //
  /////////////////////////////


  // Collect stores and routes for applets ONLY in this instance {stores: {}, routes: []}
  // Ignores user permissions
  const instance_applets_stores_and_routes = get_instance_stores_and_routes(instance_config)

  // Make Vuex#$store and replace rehydrated (by vuex-persistedstate) instance_config with received instance_config
  // (Required for the app)
  const store = create_store(instance_config, instance_applets_stores_and_routes.stores)
  store.commit('root:set_instance_config', instance_config)
  store.commit('meta/set_user', user)
  store.commit('meta/set_personalised_instance_id', personalised_instance_id)

  // Reset key UI state
  store.commit('root:set_sw_update_downloading', false)
  store.commit('root:set_sw_update_available', false)

  configure_pubsubcache_listeners(store)
  // Create listeners to act on store

  // Create Vue#$router from what you got
  // (Required for the app)
  const router = create_router(instance_applets_stores_and_routes.routes, store)

  // Configure theme, either from default or instance_config
  configure_theme(instance_config)


  /////////////////////////////
  //
  // AFTER router and store, BEFORE app
  //
  /////////////////////////////

  // Analytics (injects $ga in every component)
  instantiate_analytics(router, store)

  // Clean up old dbs, do migrations/upgrades here in the future
  clean_up_local_dbs()

  // Configure permissions
  setup_acl()

  // Clean up old dbs, do migrations/upgrades here in the future
  await clean_up_local_dbs()

  await hydrate_geodata_cache_from_idb(instance_config.instance.slug)

  /////////////////////////////
  //
  // CREATE VUE APP
  //
  /////////////////////////////

  // Instantiate Vue app with store and router
  const el_id = 'douma'
  if (!document.getElementById(el_id)) {
    const new_el = document.createElement('div')
    new_el.id = el_id
    document.getElementsByTagName('body')[0].appendChild(new_el)
  }


  douma_app = new Vue({
    replace: false,
    el: `#${el_id}`,
    router,
    store,
    vueLoading: new VueLoading(),
    render: createElement => createElement(DoumaComponent),
  })

  // For debugging, add some globals
  window.__disarm_debug_app = douma_app
  window.__disarm_debug_store = douma_app.$store
  window.__disarm_debug_state = douma_app.$store.state


  /////////////////////////////
  //
  // AFTER VUE APP IS CREATED (first page has rendered)
  //
  /////////////////////////////

  // Configure application update
  check_need_to_update()

  // Add extra info to error logging
  set_raven_user_context(douma_app.$store.state)

  // Configure on/offline watcher
  add_network_status_watcher(douma_app)

  // Keep track of what version we're working on, in production at least.
  if (BUILD_TIME.DOUMA_PRODUCTION_MODE) console.info('🚀 Launched DiSARM version ' + BUILD_TIME.VERSION_COMMIT_HASH_SHORT)


  /////////////////////////////
  //
  // CLEANUP BOOT PROCESS
  //
  /////////////////////////////

  // If made it to here, make sure loading_page is hidden, and the shell_app is removed
  hide_loading_page()
  remove_shell_app()
}

export function remove_douma_app() {
  remove_app(douma_app)
}