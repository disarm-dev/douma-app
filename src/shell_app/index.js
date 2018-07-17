import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import {has} from 'lodash'


import Shell from './shell'
import Login from './login'
import InstanceConfigs from './instance_configs'
import {hide_loading_page} from 'config/hide_loading_page'

let shell_app

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
    if (has(store.state, 'user')) return next()

    if (to.name === 'shell:login') {
      // next() if destination is the login page
      return next()
    } else {
      console.log('need to go to login')
      next({name: 'shell:login'})
    }
  })

  const store = new Vuex.Store({
    state: {
      nothing: null,
    },
    mutations: {
      set_user: (state, user) => {
        state.user = user
      }
    }
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