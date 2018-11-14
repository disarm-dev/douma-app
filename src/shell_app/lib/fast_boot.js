import {launch_main_app} from 'config/launch_main_app'

const have_enough_to_boot_main = function({user, instance_config, meta}) {
  console.log('TODO: proper tests for boot objects')
  if (!user) return false
  if (!instance_config) return false
  if (!meta) return false

  return true
}

const fast_boot = function({user, instance_config, meta}) {
  const personalised_instance_id = meta.personalised_instance_id
  return launch_main_app({user, instance_config, personalised_instance_id})
}
export {have_enough_to_boot_main,fast_boot}