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

export function get_configurations() {
  const options = {
    method: 'get',
    url_suffix: '/config',
    params: { country: 'app' }
  }

  return request_handler(options)
}

export function get_configuration(config_id) {
  const options = {
    method: 'get',
    url_suffix: `/config/${config_id}`,
    params: {country: 'app'}
  }

  return request_handler(options)
}