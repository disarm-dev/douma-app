import {shell_axios} from '../../lib/shell_request_handler'

const prefix = 'users'

async function permissions({user_id, instance_id}) {
  const request = {
    url: `/${prefix}/${user_id}/permissions/${instance_id}`,
  }
  return shell_axios(request)
}

export default {
  permissions,
}