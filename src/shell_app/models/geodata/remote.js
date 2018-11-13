import { shell_axios } from 'shell_app/lib/shell_request_handler'


async function get_geodata_layer({ level_name, instance_id }) {
  const request = {
    method: 'get',
    url: `/v8/geodata/${level_name}?instance_id=${instance_id}`
  }
  return shell_axios(request)
}


export default {
  get_geodata_layer
}