import InstanceConfigLocal from './local'
import { read_instance_config } from './remote'

const local_config_db = new InstanceConfigLocal()

export async function read_instance_congfiguration_for(config_id) {
  const local_instance_config = await local_config_db.read(config_id)

  if (local_instance_config) {
    return local_instance_config
  } else {
    const remote_instance_config = await read_instance_config(config_id)
    await local_config_db.update(remote_instance_config)
    return remote_instance_config
  }
}