import tasker from './pages/tasker.vue'

export default [
  {
    path: '/irs/tasker',
    component: tasker,
    name: 'irs_tasker',
    meta: {
      can: 'read irs_tasker',
      fail: '/meta/home'
    }
  }
]
