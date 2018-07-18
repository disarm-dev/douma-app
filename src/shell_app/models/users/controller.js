import Remote from './remote'

async function get_permissions({user, instance_config}) {
  const res = await Remote.permissions({user_id: user.id})

  console.log('fake get permissions for', user._id, 'on', instance_config.instance.slug)
  const applets = ['irs_monitor', 'irs_plan', 'irs_record_point', 'irs_tasker', 'record2', 'debug', 'bod-client']
  return Promise.resolve([
    ...applets.map(a => 'read:' + a),
    ...applets.map(a => 'write:' + a),
  ])
}

export default {
  get_permissions,
}