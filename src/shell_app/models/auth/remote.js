import {shell_request_handler} from 'shell_app/lib/shell_request_handler'

const prefix = 'auth'

async function login({username, password}) {
  const request = {
    method: 'post',
    url_suffix: `/${prefix}/login`,
  }
  return shell_request_handler(request)
}

async function logout({user}) {
  const request = {
    method: 'post',
    url_suffix: `/${prefix}/logout`,
  }
  return shell_request_handler(request)
}

export default {
  login,
  logout
}