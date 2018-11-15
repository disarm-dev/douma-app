import {retrieve_shell_data} from './lib/shell_data'
import {fast_boot, have_enough_to_boot_main} from 'shell_app/lib/shell_data'
import {launch_shell_app} from 'shell_app/lib/launch_shell_app'
// import {launch_main_app} from 'config/launch_main_app'

export function main_or_shell() {
  // Rehydrate data and try to boot straight to main_app
  const {user, instance_config, personalised_instance_id} = retrieve_shell_data()

  if (have_enough_to_boot_main({user, instance_config, personalised_instance_id})) {
    // FAST!
    // launch_main_app({user, instance_config, personalised_instance_id})
    console.log('boot main')
  } else {
    // SLOWer!
    // Not enough to boot straight to main_app, so build up what's needed
    launch_shell_app({user, instance_config, personalised_instance_id})
  }

}
