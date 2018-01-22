import edit from './pages/plan.vue'

export default [
  {
    path: '/irs/plan',
    component: edit,
    name: 'irs_plan',
    meta: {
      can: 'read irs_plan',
      fail: '/meta/home'
    }
  }
]
