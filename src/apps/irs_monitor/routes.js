import view from './pages/dashboard.vue'

export default [
  {
    path: '/irs/monitor',
    component: view,
    name: 'irs_monitor',
    meta: {
      can: 'read irs_monitor',
      fail: '/meta/home'
    }
  }
]
