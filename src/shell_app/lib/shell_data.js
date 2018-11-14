const have_enough_to_boot_main = function({user, instance_config, meta}) {
  console.log('TODO: proper tests for boot objects')
  if (!user) return false
  if (!instance_config) return false
  if (!meta) return false

  return false
}

const rehydrate_shell_data = function () {
  const user = {}
  const instance_config = {}
  const meta = {}
  return {user, instance_config, meta}
}
export {have_enough_to_boot_main, rehydrate_shell_data}