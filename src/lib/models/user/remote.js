import {request_handler} from '../../remote/request-handler.js'

export default {authenticate}

// User authentication
function authenticate(user) {
  const request = _authenticate(user)
  return request_handler(request)
}
function _authenticate(user) {
  return {
    url_suffix: '/login',
    data: user,
    method: 'post',
    timeout: 10000
  }
}
