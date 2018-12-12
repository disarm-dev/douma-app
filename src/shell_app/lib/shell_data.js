import {get_api_url} from 'lib/helpers/get_parameter'

const have_enough_to_boot_main = function({user, instance_config, personalised_instance_id}) {
  console.log('TODO: proper tests for boot objects')
  if (!user) return false
  if (!instance_config) return false
  if (!personalised_instance_id) return false

  return true
}

const retrieve_shell_data = function () {
  const api_url = get_api_url();
  const user = retrieve('user')
  const instance_config = retrieve('instance_config')
  const personalised_instance_id = retrieve('personalised_instance_id')
  return {api_url, user, instance_config, personalised_instance_id}
}

const prefix = 'disarm-shell-'

const persist_shell_data = function(key, value) {
  localStorage.setItem(prefix + key, JSON.stringify(value))
}

const retrieve = function(key) {
  return JSON.parse(localStorage.getItem(prefix + key))
}

export {have_enough_to_boot_main, persist_shell_data, retrieve_shell_data, retrieve}