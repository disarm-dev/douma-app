import {get, merge} from 'lodash'

import Remote from './remote'
import {store} from 'shell_app/launch_shell_app'

async function add_permissions({user, instance_id}) {
  const res = await Remote.permissions({user_id: user.id, instance_id})
  const permissions = get(res, 'data.permissions')
  if (permissions) {
    const user_with_permissions = merge(user, {permissions})
    store.commit('set_user', user_with_permissions)
    return user_with_permissions
  }
  return false
}

export default {
  add_permissions,
}