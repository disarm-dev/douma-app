import seasons from './seasons.vue'

export default [
  {
    path: '/irs/seasons',
    component: seasons,
    name: 'seasons',
    meta: {
      can: 'read irs_tasker',
      fail: '/meta/home'
    }
  }
]
