import InstancesController from 'shell_app/models/instances/controller'
import UsersController from 'shell_app/models/users/controller'
import {store} from 'shell_app/launch_shell_app'
import pubsubcache from 'lib/helpers/pubsubcache'

export async function get_instance_config_permissions_and_launch({instance_id}) {
  const user = store.state.user

  const instance_config = await InstancesController.published_instance_config({instance_id})

  const user_with_permissions = await UsersController.add_permissions({user, instance_id})
  console.log('TODO: add defensive checks, handle error branching')

  pubsubcache.publish('shell:launch_with_config', {instance_config, user: user_with_permissions})
}