import seasons from './seasons.vue'

export default [
  {
    path: '/irs/seasons',
    component: seasons,
    name: 'seasons',
    meta: {
      can: 'write seasons',
      fail: '/meta/home'
    }
  }
]
