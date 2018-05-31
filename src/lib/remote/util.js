import {request_handler} from './request-handler'

export function try_reconnect() {
  return request_handler({url_suffix: ''})
}

export function get_version() {
  const options = {
    url: '/VERSION',
    timeout: 15000
  }
  return request_handler(options)
}

