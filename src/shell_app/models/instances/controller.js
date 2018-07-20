import InstanceConfigLocal from './local'
import Remote from './remote'
import {store} from 'shell_app/launch_shell_app'

const local_config_db = new InstanceConfigLocal()

async function retrieve_local_config() {
  console.warn('TODO: really check local DB for existing instance_config')
  return false
}

async function published_instances() {
  return Remote.published_instances()
}

async function published_instance_config({instance_id}) {
  console.warn('TODO: missing defensive checks')
  const res = await Remote.published_instance_config({instance_id})
  const instance_config = res.data.instance_config
  store.commit('set_instance_config', instance_config)

  console.warn('TODO: write instance_config to localDB')
  return instance_config
}


export default {
  retrieve_local_config,
  published_instances,
  published_instance_config,
}