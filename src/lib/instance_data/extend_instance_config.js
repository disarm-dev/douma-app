import {get_instance_file} from 'lib/remote/instance'
import {IncomingInstanceConfigSchema} from 'lib/models/instance_config/instance_config.schema'
import CONFIG from 'config/common'


// Instance configuration and related files
export const get_instance_files = async (slug) => {
  const res = await fetch(`https://application-registry-server.herokuapp.com/api/config/${slug}`)
  const json = await res.json()
  const instance = json.config_data

  // TODO: @refac This should probably live somewhere else
  // A standard 'count' aggregation is needed for everything
  instance.aggregations.push({name: 'count', numerator_expr: '1'})

  return instance
}

