import Vue from 'vue'
import VueRouter from 'vue-router'
import {get} from 'lodash'

import {has_permission} from 'lib/models/user/permission_helper.js'
import {geodata_in_cache_and_valid} from 'lib/models/geodata/geodata.valid'
import {hydrate_geodata_cache_from_idb} from 'lib/models/geodata/local.geodata_store'

let router
export {router}

export function create_router(instance_routes, store) {
  Vue.use(VueRouter)

  // Configure routes for all Applets
  const routes = [
    {
      path: '/',
      redirect: '/meta',
    }
  ].concat(...instance_routes, {
    path: '*',
    redirect: '/'
  })

  // Instantiate `router`
  router = new VueRouter({
    routes,
    mode: 'history'
  })

  // Check if user is logged-in
  router.beforeEach((to, from, next) => {
    // next() if user already logged in
    if (store.state.meta && store.state.meta.user) return next()

    // User not logged in
    if (to.name === 'meta:login') {
      // next() if destination is the login page
      return next()
    } else {
      // Otherwise go to the login page (storing your original target)
      store.commit('meta/set_previous_route', to.path)
      return next({name: 'meta:login'})
    }
  })

  // Redirect to get geodata if needed
  router.beforeEach((to, from, next) => {

    // check if any applets require geodata, or continue
    const decorated_applets = store.getters['meta/decorated_applets']
    const to_applet = decorated_applets.find(applet => applet.name === to.name.split(":")[0])
    const geodata_required = get(to_applet, 'geodata_required', false)

    // if you're on your way to any 'meta' page, then carry on
    if (!geodata_required || to.name.startsWith('meta')) {
      return next()
    }

    // geodata is required by at least one applet. check if it's already valid
    if (!geodata_in_cache_and_valid()) {
      console.log('geodata required, NOT already exists && valid - go to a page to start getting geodata')
      store.commit('meta/set_previous_route', to.path)
      // try to hydrate geodata from IDB
      hydrate_geodata_cache_from_idb().then(() => {
        if (geodata_in_cache_and_valid()) {
          return next()
        } else {
          return next({name: 'meta:geodata'})
        }
      })
    } else {
      console.log('geodata required, already exists && valid')
      return next()
    }

  })

  return router
}

