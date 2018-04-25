import { read_instance_congfiguration_for } from 'lib/models/instance_config/model'

/**
 *
 * @param instance_slug
 * @returns {Promise<*>}
 */
export async function get_instance_config(instance_slug) {
  try {
    const instance_config = await read_instance_congfiguration_for(instance_slug)

    // TODO: @refac fix this
    if (instance_config.aggregations) {
      instance_config.aggregations.push({ name: 'count', numerator_expr: '1' })
    }

    return instance_config
  } catch (e) {
    const msg = `You might be looking for an application which does not exist. Cannot find application configuration file for subdomain "${instance_slug}". `
    alert(msg)
    return new Error(msg)
  }
}
