import { request_handler } from 'lib/remote/request-handler'

export function read_instance_config(instance) {
  const request = _read_instance_config(instance)
  return request_handler(request)
}

function _read_instance_config(instance) {
  return {
    url_suffix: `/config/${instance}`,
    timeout: 10000,
    params: {
      country: 'app'
    }
  }
}
