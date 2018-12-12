import Remote from './remote'

async function login({ username, password, personalised_instance_id}) {
  const res = await Remote.login({ username, password, personalised_instance_id})

  // GET user permissions here

  const permissions_res = await Remote.get_permissions({user_id: res.data._id})

  res.data.permissions = permissions_res.data

  res.personalised_instance_id = personalised_instance_id

  return res
}

function prepare_user_for_instance(instance, user) {
  user.permissions = user.permissions.filter(p => p.instance_id === instance).map(p => p.value)
  return user
}

export const AuthController = {
  prepare_user_for_instance,
  login,
}
