import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Shell from './shell'
import Login from './login'

let shell_app

export function launch_shell_app() {

  const routes = [
    {
      path: '/',
      component: Login,
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
  })
}

export function remove_shell_app() {
  if (shell_app) {
    console.log('shell_app exists - need to remove',)
  } else {
    console.log('shell_app DOES NOT exists - NO need to remove',)
  }
}