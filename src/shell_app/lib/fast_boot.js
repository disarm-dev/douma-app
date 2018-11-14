import {launch_main_app} from 'config/launch_main_app'

const fast_boot = function({user, instance_config, meta}) {
  console.log('check if have enough to boot straight to main_app')
  if (!user) return false
  if (!instance_config) return false
  if (!meta) return false
  console.log("Got enough - or at least, no tests failed. Booting into main_app!")


  return false // debug

  const personalised_instance_id = meta.personalised_instance_id
  return launch_main_app({user, instance_config, personalised_instance_id})
}
export {fast_boot}