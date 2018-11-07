import {shell_axios} from 'shell_app/lib/shell_request_handler'

function published_instances({user_id}) {
  const request = {
    url: `/instance`,
    params: {
      user_id: user_id
    }
  }
  return shell_axios(request)
}

export default {
  published_instances,
}
