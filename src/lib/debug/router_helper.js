// Mainly for debugging help
// Pass an instantiated $router object
// Log out a table of all possible route URLs

function route_table(router) {
  if (!router.hasOwnProperty('options')) throw new Error("Sure you passed a $router object? No `options` property found")
  const routes = router.options.routes
  let output = []

  function get_routes(routes, path_prefix = '') {
    for (var i = routes.length - 1; i >= 0; i--) {
      const route = routes[i]
      const path = `${path_prefix}${route.path}`

      if (path !== '*') {
        output.push(path)
      }

      if(route.hasOwnProperty('children')) {
        get_routes(route.children, `${path}/`)
      }
    }
  }

  get_routes(routes)

  return output.reverse()
}

export {route_table}
