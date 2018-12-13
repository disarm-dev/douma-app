import { shell_axios } from 'shell_app/lib/shell_request_handler'

function instance_config({ id }) {
  const request = {
    url: `/config/${id}`,
  }
  return shell_axios(request)
}

export default {
  instance_config,
}
