import Vue from 'vue'
import Acl from 'vue-browser-acl'

import CONFIG from 'config/common'
import {store} from 'apps/store'
import {router} from 'apps/router'

export function setup_acl() {
  // Plugins can only be registered once
  // The `install` function is run when they are registered
  // We're creating a function that can be called many times to
  // change the permissions registers
  //
  // We can pass 3 arguments to Acl's install function:
  // - a user object or a function to get the user
  //   if it's a function it's called every time a $can is checked

  // Return this is called from configure_application.
  const get_user = () => store.state.meta.user
  if (!get_user()) return

  function setup_permissions (acl) {
    const applets = Object.keys(CONFIG.applets)
    const permission_options = ['read', 'write']

    for (const applet of applets) {
      for (const permission_option of permission_options) {
        const permission = `${permission_option}:${applet}`
        acl.rule(permission_option, applet, check_permission_for_user(permission))
      }
    }
  }

  Vue.use(Acl, get_user, setup_permissions, {router})
}

function check_permission_for_user (permission) {
  return (user) => {
    // 'user' exists inside scope of `setup_permissions`, as result of the
    // second argument to Vue.use(Acl, user...) - i.e. result of `get_user`
    return user.permissions.includes(permission)
  }
}