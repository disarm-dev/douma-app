import InstanceConfigLocal from './local'
import { read_instance_config } from './remote'

const local_config_db = new InstanceConfigLocal()

export async function read_instance_congfiguration_for(config_id) {
  try {
    const remote_instance_config = await retrieve_and_store_remote_config(config_id)
    if (remote_instance_config) return remote_instance_config
    const local_instance_config = await retrieve_local_config(config_id)
    if (local_instance_config) {
      return local_instance_config
    } else {
      throw new Error("Cannot retrieve configuration from remote or local")
    }
  } catch (e) {
    alert("Cannot load configuration. Please try reloading the page.")
  }
}

async function retrieve_local_config(config_id) {
  return await local_config_db.read(config_id)
}

async function retrieve_and_store_remote_config(config_id) {
  try {
    const remote_instance_config = await read_instance_config(config_id)
    // TODO: Check this is a valid instance_config
    await local_config_db.update(remote_instance_config)
    return remote_instance_config
  } catch(e) {
    // TODO: Check error type
    console.error(e)
    return null
  }
}