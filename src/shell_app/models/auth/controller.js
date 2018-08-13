import {get} from 'lodash'

import {add_token_to_headers} from '../../lib/shell_request_handler'
import Remote from './remote'

async function login({username, password}) {
  const res = await Remote.login({username, password})
  const token = get(res, 'data.key')
  if (token) {
    add_token_to_headers(token)
  }
  return res
}

export default {
  login,
}