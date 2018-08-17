import {shell_axios} from 'shell_app/lib/shell_request_handler'


async function login({ username, password, personalised_instance_id}) {
  const request = {
    method: 'post',
    url: `/login`,
    data: {
      username, 
      password
    },
    params: {
      personalised_instance_id
    }
  }
  return shell_axios(request)
}

export default {
  login
}