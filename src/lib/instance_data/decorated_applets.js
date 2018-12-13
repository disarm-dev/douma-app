import CONFIG from 'config/common'
import {available_applets} from 'config/applet_stores_and_routes'
import {chain, intersection, without} from 'lodash'

/**
 * Export a `decorated_applets` object on this file, containing title and icon for each
 * @param instance_config
 */
export const decorate_applets = ({user_allowed_applets, instance_applets}) => {
  let decorations = []
  const instance_config_applet_name = Object.keys(instance_applets)
  const available_applet_names = Object.keys(available_applets)

  // From all the available applets, find those in the current config
  // From the available ones in the current config, find any authorised ones
  const available_configured_allowed = intersection(available_applet_names, instance_config_applet_name, user_allowed_applets)

  // Remove 'meta', because it is just routes, not appearing in any menus
  const without_meta = without(available_configured_allowed, 'meta')

  without_meta.forEach(name => {
    decorations.push({name, ...properties_for(name, instance_applets)})
  })

  return decorations
}

function properties_for (applet_name, instance_applets) {
  if (!applet_name) return {}

  // Find all possible configurations
  const common_config_for_applet = CONFIG.applets[applet_name]
  const instance_config_for_applet = instance_applets[applet_name]

  // Overwrite any common_config title and icon
  return {...common_config_for_applet, ...instance_config_for_applet}
}

