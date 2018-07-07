import applet from './applet.vue'

export default [
  {
    path: '/irs/record2',
    component: applet,
    name: 'record2',
    meta: {
      can: 'read record2',
      fail: '/meta/home'
    }
  }
]
