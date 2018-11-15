const have_enough_to_boot_main = function({user, instance_config, meta}) {
  console.log('TODO: proper tests for boot objects')
  if (!user) return false
  if (!instance_config) return false
  if (!meta) return false

  return false
}

const persist_shell_data = function({user, instance_config, personalised_instance_id}) {
  set('user', user)
  set('instance_config', instance_config)
  set('personalised_instance_id', personalised_instance_id)
}

const set = function(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const retrieve_shell_data = function () {
  const user = localStorage.getItem('user')
  const instance_config = localStorage.getItem('instance_config')
  const personalised_instance_id = localStorage.getItem('personalised_instance_id')
  return {user, instance_config, personalised_instance_id}
}

export {have_enough_to_boot_main, persist_shell_data, retrieve_shell_data}