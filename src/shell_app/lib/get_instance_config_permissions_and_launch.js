import InstancesController from 'shell_app/models/instances/controller'
import {store} from 'shell_app/launch_shell_app'
import pubsubcache from 'lib/helpers/pubsubcache'

export async function get_instance_config({id}) {

  const response = await InstancesController.instance_config({id})

  const instance_config = response.lob

  store.commit('set_instance_config', instance_config)

  delete response.lob

  store.commit('set_instance', response)
}

export function launch({instance, lob: instance_config}, user) {
  const personalised_instance_id = store.state.personalised_instance_id

  pubsubcache.publish('shell:launch_with_config', { instance_config, user, personalised_instance_id})
}