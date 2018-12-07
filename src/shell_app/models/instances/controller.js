import InstanceLocal from './local'
import Remote from './remote'

async function instances_for_user({user}) {
  const res = await Remote.instances_for_user({ user })

  const instances = res.data
  return instances
}

export const InstancesController = {
  instances_for_user,
}
