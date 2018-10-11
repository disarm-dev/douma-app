import InstanceLocal from './local'
import Remote from './remote'

const local_instance_db = new InstanceLocal()

async function retrieve_local_instances() {
  const instances = await local_instance_db.read_all()
  return instances
}

async function published_instances({user_id}) {
  const res = await Remote.published_instances({ user_id })
  
  const instances = res.data
 // await save_instances_locally(instances)

  return instances
}

async function save_instances_locally(instances) {
  await local_instance_db.bulkPut(instances)
}

export default {
  retrieve_local_instances,
  published_instances
}
