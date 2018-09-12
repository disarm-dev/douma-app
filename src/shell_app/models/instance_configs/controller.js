import InstanceConfigLocal from './local'
import Remote from './remote'

/**
 * Local
 */

 const local_config_db = new InstanceConfigLocal()

async function retrieve_local_config() {
  const instances = await local_config_db.read_all()
  return instances[0]
}

async function retrieve_local_configs() {
  const instances = await local_config_db.read_all()
  return instances
}

async function save_instance_config_locally(instance_config) {
  await local_config_db.update(instance_config)
}

/**
 * Remote
 */

async function published_instance_config({ id }) {
  // console.warn('TODO: missing defensive checks')
  const res = await Remote.published_instance_config({ id })
  const instance_config = res.data
  // store.commit('set_instance_config', instance_config)

  // save_instance_locally(instance_config)
  return instance_config
}

async function instance_config({ id }) {
  const res = await Remote.instance_config({ id })
  save_instance_config_locally(res.data)
  return res.data
}


export default {
  retrieve_local_config,
  retrieve_local_configs,
  published_instance_config,
  instance_config,
  save_instance_config_locally
}