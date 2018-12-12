import {request_handler} from './request-handler'

export function try_reconnect() {
  return request_handler({url: ''})
}

