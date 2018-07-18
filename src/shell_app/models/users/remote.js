import {shell_request_handler} from '../../lib/shell_request_handler'

const prefix = 'users'

async function permissions({user_id}) {
  const request = {
    method: 'get',
    url_suffix: `/${prefix}/permissions/${user_id}`,
    headers: {
      Authorization: 'some_token'
    }
  }
  return shell_request_handler(request)
}

export default {
  permissions,
}