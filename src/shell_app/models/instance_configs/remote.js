import { shell_axios } from 'shell_app/lib/shell_request_handler'

function published_instance_config({ id }) {
  const request = {
    url: `/v8/instance/${id}/published_instanceconfigs`,
  }
  return shell_axios(request)
}

function instance_config({ id }) {
  const request = {
    url: `/v8/config/${id}`,
  }
  return shell_axios(request)
}

export default {
  instance_config,
  published_instance_config,
}
