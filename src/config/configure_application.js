import Vue from 'vue'

import VueWorker from 'vue-worker'
Vue.use(VueWorker)

import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

// Components
import {ClientTable} from 'vue-tables-2'
Vue.use(ClientTable)

import TreeView from "vue-json-tree-view"
Vue.use(TreeView)

import VueShortkey from 'vue-shortkey'
Vue.use(VueShortkey)

// VueMaterial
import VueMaterial from 'vue-material'
Vue.use(VueMaterial)


import DoumaComponent from 'components/app.vue'
import {create_router} from '../apps/router'
import {create_store} from '../apps/store'
import {get_instance_stores_and_routes} from './applet_stores_and_routes'
import {configure_theme} from './theme'
import {instantiate_analytics, set_common_analytics} from 'config/analytics'
import {configure_spatial_helpers} from 'lib/instance_data/spatial_hierarchy_helper'
import {try_reconnect} from 'lib/remote/util'
import {add_network_status_watcher} from 'lib/helpers/network_status.js'
import pubsubcache from 'lib/helpers/pubsubcache'
import {need_to_update} from 'lib/remote/check-application-version'
import {set_raven_user_context} from 'config/error_tracking.js'
import {instantiate_axios_instance} from 'lib/remote/axios_instance'
import BUILD_TIME from 'config/build-time'
import {clean_up_local_dbs} from "lib/local_db"
import {setup_acl} from "lib/acess-control-list"


/**
 * Build a 'douma_app' instance
 * @param instance_config
 * @returns {Vue}
 */
export function configure_application (instance_config) {


  // CREATE REQUIRED OBJECTS FOR APP (store AND router)


  // Collect stores and routes for applets ONLY in this instance {stores: {}, routes: []}
  // Ignores user permissions
  const instance_applets_stores_and_routes = get_instance_stores_and_routes(instance_config)

  // Make Vuex#$store and replace rehydrated (by vuex-persistedstate) instance_config with received instance_config
  // (Required for the app)
  const store = create_store(instance_config, instance_applets_stores_and_routes.stores)
  store.commit('root:set_instance_config', instance_config)

  // Create Vue#$router from what you got
  // (Required for the app)
  const router = create_router(instance_applets_stores_and_routes.routes, store)

  // Configure theme, either from default or instance_config
  configure_theme(instance_config)


  // BEFORE VUE APP IS CREATED (USING store OR router)


  // Configure spatial_helpers to use instance_config
  configure_spatial_helpers(instance_config)
  console.log('TODO: @idea 🤔 Can we start getting the tile-cover thing going here, to cache all needed vector tiles? https://github.com/mapbox/tile-cover')

  // Configure standard_handler for remote requests
  // Also trigger a ping to API, for lots of reasons, mostly that the API seems to take ages to wake up
  // (Loads of components use network requests when they are created/mounted)
  try_reconnect()

  // Analytics 1/2: instantiate analytics before you create the application
  // (Vue injects $ga in every component)
  instantiate_analytics(router)

  // Clean up old dbs, do migrations/upgrades here in the future
  clean_up_local_dbs()


  setup_acl()
  // CREATE VUE APP

  // Instantiate Vue app with store and router
  const douma_app = new Vue({
    el: '#douma',
    router,
    store,
    render: createElement => createElement(DoumaComponent),
  })

  window.__disarm_debug_app = douma_app


  // AFTER VUE APP IS CREATED (first page has rendered)


  // Analytics 2/2: set common properties (e.g. user) for every event
  // (App needs to be running to send the first requests setting user props, etc)
  set_common_analytics(douma_app)

  // Configure application update
  need_to_update().then((can_update) => {
    const update_available = (can_update.status === 'CAN_UPDATE')

    // Make sure we can catch any messages passed from ServiceWorker
    pubsubcache.subscribe('service_worker/onstatechange', (topic, args) => {

      const new_service_worker_activated = (args === 'activated')
      if (update_available && new_service_worker_activated) {
        douma_app.$store.commit('root:set_sw_update_available', true)
      } else {
        douma_app.$store.commit('root:set_sw_update_available', false)
      }

      console.log('service_worker/onstatechange message:', args)
    })
  })

  // Add extra info to error logging
  set_raven_user_context(douma_app.$store.state)

  // Configure on/offline watcher
  add_network_status_watcher(douma_app)

  // Keep track of what version we're working on, in production at least.
  if (BUILD_TIME.DOUMA_PRODUCTION_MODE) console.info('🚀 Launched DiSARM version ' + BUILD_TIME.VERSION_COMMIT_HASH_SHORT)

}

export function boot_app() {
  // This is only enought to get the application launching without any errors
  // We need a lot of stuff from the function above

  const config_for_boot = { applets: { meta: {} }, instance: {title: 'instance'} }
  const instance_applets_stores_and_routes = get_instance_stores_and_routes(config_for_boot)
  
  const store = create_store(config_for_boot, instance_applets_stores_and_routes.stores)
  store.commit('root:set_instance_config', config_for_boot)
  const router = create_router(instance_applets_stores_and_routes.routes, store)


  instantiate_analytics(router)
  const douma_app = new Vue({
    el: '#douma',
    router,
    store,
    render: createElement => createElement(DoumaComponent),
  })
  set_common_analytics(douma_app)
}

export function do_stuff_after_login_and_we_know_which_applets_you_are_allowed_to_use_but_first_we_need_to_select_an_instance(instance_name, store, router) {
  // TODO: We need to dynamically register the applet stores here.
  // https://vuex.vuejs.org/en/modules.html#dynamic-module-registration

  // TODO: We need to dynamically register the routes here using:
  // router.addRoutes(routes)
}