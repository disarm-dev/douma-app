import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueLoading from 'vuex-loading'
import {get} from 'lodash'
import createPersistedState from 'vuex-persistedstate'

import Shell from './pages/Shell'
import Login from './pages/Login'
import InstanceConfigs from './pages/Instances'
import {hide_loading_page} from 'config/hide_loading_page'
import {remove_douma_app} from 'config/launch_main_app'
import {remove_app} from 'config/remove_app'

let shell_app
export let store

export function launch_shell_app() {

  const routes = [
    {
      path: '/',
      name: 'shell:login',
      component: Login,
    },
    {
      path: '/instance_configs',
      name: 'shell:instance_configs',
      component: InstanceConfigs,
    },
    {
      path: '*',
      redirect: '/'
    }
  ]

  const router = new VueRouter({
    routes,
    mode: 'history'
  })

  router.beforeEach((to, from, next) => {
    if (get(store.state, 'user', false)) return next()

    if (to.name === 'shell:login') {
      // next() if destination is the login page
      return next()
    } else {
      next({name: 'shell:login'})
    }
  })

  store = new Vuex.Store({
    plugins: [createPersistedState({key: 'disarm_shell_app'})],
    state: {
      user: null,
      instance_config: null,
      personalised_instance_id: 'default'
    },
    mutations: {
      set_user: (state, user) => state.user = user,
      set_personalised_instance_id: (state, personalised_instance_id) => state.personalised_instance_id = personalised_instance_id,
      set_instance_config: (state, instance_config) => state.instance_config = instance_config,
    },
  })

  // TODO: Check if necessary to manually recreate the div like this
  const el_id = 'shell'
  if (!document.getElementById(el_id)) {
    const new_el = document.createElement('div')
    new_el.id = el_id
    document.getElementsByTagName('body')[0].appendChild(new_el)
  }

  shell_app = new Vue({
    replace: false,
    el: `#${el_id}`,
    router,
    store,
    vueLoading: new VueLoading(),
    render: createElement => createElement(Shell),
  })

  window.__shell_app_debug = shell_app

  // Cleanup
  hide_loading_page()
  remove_douma_app()
}

export function remove_shell_app() {
  remove_app(shell_app)
}

