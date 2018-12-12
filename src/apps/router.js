import VueRouter from 'vue-router'
import {store_api_url_if_found_as_query_param} from 'lib/helpers/get_parameter'
import {store} from 'apps/store'

let router
export {router}

export function create_router(instance_routes) {

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

  router.beforeEach((to, from, next) => {
    store_api_url_if_found_as_query_param(store);
  })

  return router
}

