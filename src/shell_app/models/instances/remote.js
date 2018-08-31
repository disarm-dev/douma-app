import {shell_axios} from 'shell_app/lib/shell_request_handler'

const prefix = 'config'

function published_instances({user_id}) {
  const request = {
    url: `/instances`,
    params: {
      user_id: user_id
    }
  }
  return shell_axios(request)
}

function published_instance_config({id}) {
  const request = {
    url: `/instances/${id}/published_instanceconfigs`,
  }
  return shell_axios(request)
}

function instance_config({id}) {
  const request = {
    url: `/instanceconfigs/${id}`,
  }
  return shell_axios(request)
}

export default {
  instance_config,
  published_instances,
  published_instance_config,
}