import InstanceConfigLocal from './local'
import { read_instance_config } from './remote'

const local_config_db = new InstanceConfigLocal()

export async function read_instance_congfiguration_for(config_id) {
  try {
    const remote_instance_config = await retrieve_and_store_remote_config(config_id)
    return remote_instance_config
  } catch (e) {
    const local_instance_config = await retrieve_local_config(config_id)
    return local_instance_config
  }
}

async function retrieve_local_config(config_id) {
  const local_instance_config = await local_config_db.read(config_id)
  return local_instance_config
}

async function retrieve_and_store_remote_config(config_id) {
  const remote_instance_config = await read_instance_config(config_id)
  await local_config_db.update(remote_instance_config)
  return remote_instance_config
}