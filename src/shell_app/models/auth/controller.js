import Remote from './remote'
import {store} from 'shell_app/lib/launch_shell_app'

async function login({ username, password, personalised_instance_id}) {
  let user

  // Authenticate
  try {
    const res = await Remote.login({ username, password, personalised_instance_id})
    user = res.data
    store.commit('set_user', user)
  } catch (e) {
    throw e
  }

  // Authorise
  try {
    const permissions_res = await Remote.get_permissions({user_id: user._id})
    user.permissions = permissions_res.data
  } catch (e) {
    throw e
  }

  if (!user) {
    throw new Error('Invalid user created')
  }
  return user
}

export const AuthController = {
  login,
}
