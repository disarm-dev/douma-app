import {rehydrate_shell_data} from './lib/rehydrate_shell_data'
import {fast_boot, have_enough_to_boot_main} from 'shell_app/lib/fast_boot'
import {launch_shell_app} from 'shell_app/lib/launch_shell_app'

export function slow_or_fast_boot({reset_instance = false} = {}) {
  // Rehydrate data and try to boot straight to main_app
  const {user, instance_config, meta} = rehydrate_shell_data()

  if (have_enough_to_boot_main({user, instance_config, meta})) {
    // FAST!
    fast_boot({user, instance_config, meta})
  } else {
    // SLOWer!
    // Not enough to boot straight to main_app, so build up what's needed
    launch_shell_app(reset_instance)
  }

}
