import {configure_spatial_helpers} from 'lib/instance_data/spatial_hierarchy_helper'
import {launch_main_app} from 'config/launch_main_app'
import {AuthController} from 'shell_app/models/auth/controller'
import {geodata_required} from 'shell_app/models/geodata/controller'
import {hydrate_geodata_cache_from_idb} from 'lib/models/geodata/local.geodata_store'
import {geodata_in_cache_and_valid} from 'lib/models/geodata/geodata.valid'
import {InstanceConfigsController} from 'shell_app/models/instance_configs/controller'

async function launch_from_instance_id(id, store) {
  const instance_config = await InstanceConfigsController.instance_config({id})
  const user = store.state.user
  const personalised_instance_id = store.state.personalised_instance_id

  // Store an INSTANCE_CONFIG
  store.commit('set_instance_config', instance_config)


  // remove permissions for other instances
  let copy_of_user = {...user} // copy so we don't mutate state, which is bad
  copy_of_user = AuthController.prepare_user_for_instance(instance_config.instance_id, copy_of_user)
  const required = geodata_required(copy_of_user.permissions)

  if (!required) {
    return launch_main_app({instance_config, user: copy_of_user, personalised_instance_id})
  }

  configure_spatial_helpers(instance_config)

  await hydrate_geodata_cache_from_idb(instance_config.instance.slug)
  const valid = geodata_in_cache_and_valid()

  if (valid) {
    return launch_main_app({instance_config, user: copy_of_user, personalised_instance_id})
  } else {
    return false
  }
}

export {launch_from_instance_id}