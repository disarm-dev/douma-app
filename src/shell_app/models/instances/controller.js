import InstanceConfigLocal from './local'
import Remote from './remote'
import {store} from 'shell_app/launch_shell_app'

const local_config_db = new InstanceConfigLocal()

async function retrieve_local_config() {
  const instances = await local_config_db.read_all()
  return instances[0]
}

async function retrieve_local_configs() {
  const instances = await local_config_db.read_all()
  return instances
}

async function published_instances() {
  return Remote.published_instances()
}

async function published_instance_config({instance_id}) {
  console.warn('TODO: missing defensive checks')
  const res = await Remote.published_instance_config({instance_id})
  const instance_config = res.data
  store.commit('set_instance_config', instance_config)

  save_instance_locally(instance_config)
  return instance_config
}

async function save_instance_locally(instance_config) {
  await local_config_db.update(instance_config)
}


export default {
  retrieve_local_config,
  retrieve_local_configs,
  published_instances,
  published_instance_config,
  save_instance_locally
}