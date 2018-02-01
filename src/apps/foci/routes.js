import front_page from './pages/front_page.vue'

export default [
  {
    path: '/foci',
    component: front_page,
    name: 'foci',
    meta: {
      can: 'read foci',
      fail: '/meta/home'
    }
  }
]