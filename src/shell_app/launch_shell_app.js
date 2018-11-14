import {rehydrate_shell_data} from './lib/rehydrate_shell_data'
import {fast_boot} from 'shell_app/lib/fast_boot'
import {configure_shell_app} from 'shell_app/lib/configure_shell_app'

export function launch_shell_app({reset_instance = false} = {}) {

  // Rehydrate data and try to boot straight to main_app
  const {user, instance_config, meta} = rehydrate_shell_data()
  fast_boot({user, instance_config, meta})

  // Not enough to boot straight to main_app, so build up what's needed
  configure_shell_app(reset_instance)
}
