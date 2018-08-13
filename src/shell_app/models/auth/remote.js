import {shell_axios} from 'shell_app/lib/shell_request_handler'


async function login({username, password}) {
  const request = {
    method: 'post',
    url: `/login`,
    data: {
      username, 
      password
    }
  }
  return shell_axios(request)
}

export default {
  login
}