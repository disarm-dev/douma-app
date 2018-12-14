import { shell_axios } from 'shell_app/lib/shell_request_handler'


async function get_geodata_layer({ level_id }) {
  const request = {
    method: 'get',
    url: `/geodata_level/download`,
    params: {
      level_id,
    }
  }
  return shell_axios(request)
}


export default {
  get_geodata_layer
}
