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

  // TODO: This map is very bad, it losses info on which instance the permissions belongs to
  const permission_strings = permissions_res.data.map(p => p.value)

  res.data.permissions = permission_strings

  res.personalised_instance_id = personalised_instance_id

  return res
}

export default {
  login,
}