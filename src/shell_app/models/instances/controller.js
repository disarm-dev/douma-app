import Remote from './remote'

async function instances_for_user({user}) {
  const res = await Remote.instances_for_user({ user })
  
  const instances = res.data
  return instances
}

async function config_for_instance({instance}) {
  const res = await Remote.config_for_instance({instance})
  const config = res.data
  return config
}

export const InstancesController = {
  instances_for_user,
  config_for_instance,
}
