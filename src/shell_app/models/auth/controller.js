import {get} from 'lodash'

import {add_token_to_headers} from '../../lib/shell_request_handler'
import Remote from './remote'

async function login({ username, password, personalised_instance_id}) {
  const res = await Remote.login({ username, password, personalised_instance_id})
  const token = get(res, 'data.key')
  
  if (token) {
    add_token_to_headers(token)
  }

  res.personalised_instance_id = personalised_instance_id

  return res
}

export default {
  login,
}