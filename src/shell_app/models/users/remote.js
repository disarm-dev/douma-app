import {shell_axios} from '../../lib/shell_request_handler'

const prefix = 'users'

async function permissions({user_id}) {
  const request = {
    method: 'get',
    url_suffix: `/${prefix}/permissions/${user_id}`,
    headers: {
      Authorization: 'some_token'
    }
  }
  return shell_axios(request)
}

export default {
  permissions,
}