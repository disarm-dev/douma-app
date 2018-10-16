import InstanceConfigLocal from './local'
import config from '../../../demo-app.config.json'

const local_config_db = new InstanceConfigLocal()

export async function read_instance_configuration_for(config_id) {
  try {
    const remote_instance_config = await retrieve_and_store_remote_config(config_id)
    if (remote_instance_config) return remote_instance_config
    const local_instance_config = await retrieve_local_config(config_id)
    if (local_instance_config) {
      return local_instance_config
    } else {
      alert("Cannot retrieve configuration from remote or local. Please try reloading the page.")
    }
  } catch (e) {
    return null
  }
}

export async function retrieve_local_config(config_id) {
  return await local_config_db.read(config_id)
}

async function retrieve_and_store_remote_config(config_id) {
  try {
    const remote_instance_config = config
    // TODO: Check this is a valid instance_config
    await local_config_db.update(remote_instance_config)
    return remote_instance_config
  } catch(e) {
    // TODO: Check error type
    console.error(e)
    return null
  }
}

export async function save_local_config(instance_config) {
  await local_config_db.update(instance_config)
}