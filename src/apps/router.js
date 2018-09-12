import VueRouter from 'vue-router'

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
  return router
}

