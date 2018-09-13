import {get} from 'lodash'

import {add_token_to_headers} from '../../lib/shell_request_handler'
import Remote from './remote'

async function login({ username, password, personalised_instance_id}) {
  const res = await Remote.login({ username, password, personalised_instance_id})
  const token = get(res, 'data.api_key')
  if (token) {
    add_token_to_headers(token)
  }

  // GET user permissions here
  const permissions_res = await Remote.get_permissions({user_id: res.data.id})

  res.data.permissions = permissions_res.data

  res.personalised_instance_id = personalised_instance_id

  return res
}

function prepare_user_for_instance(instance, user) {
  user.permissions = user.permissions.filter(p => p.instance_id === instance).map(p => p.value)
  return user
}

export default {
  prepare_user_for_instance,
  login,
}