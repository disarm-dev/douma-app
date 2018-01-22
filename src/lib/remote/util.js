import {request_handler} from './request-handler'
import CONFIG from 'config/common'

export function try_reconnect() {
  return request_handler({url_suffix: ''})
}

export function get_version() {
  const options = {
    url: '/VERSION',
    timeout: 2000
  }
  return request_handler(options)
}

