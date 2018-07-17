import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Shell from './shell'
import Login from './login'
import InstanceConfigs from './instance_configs'
import {hide_loading_page} from 'config/hide_loading_page'

let shell_app

export function launch_shell_app() {

  const routes = [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/instance_configs',
      name: 'instance_configs',
      component: InstanceConfigs,
    },
    {
      path: '*',
      redirect: '/instance_configs'
    }
  ]

  const router = new VueRouter({
    routes,
    mode: 'history'
  })

  const store = new Vuex.Store({
    state: {
      nothing: null,
    },
  })

  shell_app = new Vue({
    el: '#shell',
    router,
    store,
    render: createElement => createElement(Shell),
    beforeDestroy() {
      console.log('beforeDestroy shell_app')
    },
    destroyed() {
      console.log('shell_app destroyed, remove from DOM')
    }
  })

  if (shell_app) hide_loading_page()
}

export function remove_shell_app() {
  if (shell_app) {
    shell_app.$destroy()
    shell_app.$off()
    shell_app.$el.remove()
    shell_app = null
    console.log('shell_app destroyed')
  } else {
    console.log('shell_app DOES NOT exists - NO need to remove',)
  }
}