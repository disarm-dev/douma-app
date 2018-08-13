import {shell_axios} from 'shell_app/lib/shell_request_handler'

const prefix = 'config'

function published_instances() {
  const request = {
    url: `/${prefix}`
  }
  return shell_axios(request)
}

function published_instance_config({instance_id}) {
  const request = {
    url: `/${prefix}/${instance_id}`,
  }
  return shell_axios(request)
}

export default {
  published_instances,
  published_instance_config,
}