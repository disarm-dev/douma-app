import intersection from 'lodash.intersection'
import without from 'lodash.without'

import CONFIG from 'config/common'

/**
 * Export a `decorated_applets` object on this file, containing title and icon for each
 * @param instance_config
 */
export const decorate_applets = ({user_allowed_applets, instance_applets}) => {
  let decorations = []

  // Get the applets from instance_config, find any authorised ones, and remove 'meta'
  const sorted_allowed_applets = without(intersection(Object.keys(instance_applets), user_allowed_applets), 'meta')

  sorted_allowed_applets.forEach(name => {
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

