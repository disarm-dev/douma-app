import {shell_axios} from 'shell_app/lib/shell_request_handler'

function instances_for_user({user}) {
  const user_id = user._id
  
  const request = {
    url: `/instance`,
    params: {
      user_id: user_id
    }
  }
  return shell_axios(request)
}

function config_for_instance({instance}) {
  const request = {
    url: `/config/latest`,
    params: {
      instance_id: instance._id,
    },
  }
  return shell_axios(request)
}

export default {
  instances_for_user,
  config_for_instance,
}
