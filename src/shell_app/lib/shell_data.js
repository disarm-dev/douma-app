const have_enough_to_boot_main = function({user, instance_config, personalised_instance_id}) {
  console.log('TODO: proper tests for boot objects')
  if (!user) return false
  if (!instance_config) return false
  if (!personalised_instance_id) return false

  return true
}

const persist_shell_data = function({user, instance_config, personalised_instance_id}) {
  set('user', user)
  set('instance_config', instance_config)
  set('personalised_instance_id', personalised_instance_id)
}

const retrieve_shell_data = function () {
  const user = get('user')
  const instance_config = get('instance_config')
  const personalised_instance_id = get('personalised_instance_id')
  return {user, instance_config, personalised_instance_id}
}

const prefix = 'disarm-shell-'

const set = function(key, value) {
  localStorage.setItem(prefix + key, JSON.stringify(value))
}

const get = function(key) {
  return JSON.parse(localStorage.getItem(prefix + key))
}

export {have_enough_to_boot_main, persist_shell_data, retrieve_shell_data}