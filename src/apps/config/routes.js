import config from './config.vue'

export default [
  {
    path: '/config',
    component: config,
    name: 'config',
    meta: {
      can: 'write config',
      fail: '/meta/home'
    }
  }
]
