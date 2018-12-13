import CONFIG from 'config/common'

// Build semi-dynamic list of applets
const applet_names = Object.keys(CONFIG.applets)
export let available_applets = {}
applet_names.forEach(name => available_applets[name] = require('apps/' + name))

/**
 * Collect stores and routes for applets ONLY in this instance {stores: {}, routes: []}
 * Ignores user permissions
 * @param instance_config
 * @returns {{stores: {}, routes: Array}}
 */
export function get_instance_stores_and_routes(instance_config) {
  let stores_and_routes = {stores: {}, routes: []}

  // Require instance_applets
  const applet_names = Object.keys(available_applets)

  let applets = []

  applet_names.forEach(applet_name => {
    applets[applet_name] = available_applets[applet_name]
  })


  // Get list of applets in instance, e.g. ['irs_monitor', 'irs_plan', ...]
  const instance_applet_names = Object.keys(instance_config.applets)

  instance_applet_names.forEach(name => {
    if (applets[name]) {
      stores_and_routes.stores[name] = applets[name].store
      stores_and_routes.routes.push(applets[name].routes)
    }
  })

  return stores_and_routes
}
