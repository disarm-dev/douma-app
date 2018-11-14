import InstancesController from 'shell_app/models/instances/controller'
import {store} from 'shell_app/lib/configure_shell_app'
import {launch_main_app} from 'config/launch_main_app'

export async function get_instance_config({id}) {

  const response = await InstancesController.instance_config({id})

  const instance_config = response.lob

  store.commit('set_instance_config', instance_config)

  delete response.lob

  store.commit('set_instance', response)
}

export function launch({instance, instance_config}, user) {
  const personalised_instance_id = store.state.personalised_instance_id
  launch_main_app({ instance_config, user, personalised_instance_id})
}
