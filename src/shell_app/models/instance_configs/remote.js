import { shell_axios } from 'shell_app/lib/shell_request_handler'

function published_instance_config({ id }) {
  const request = {
    url: `/v1/instances/${id}/published_instanceconfigs`,
  }
  return shell_axios(request)
}

function instance_config({ id }) {
  const request = {
    url: `/instanceconfigs/${id}`,
  }
  return shell_axios(request)
}

export default {
  instance_config,
  published_instance_config,
}