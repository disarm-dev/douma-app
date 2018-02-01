import front_page from './pages/front_page.vue'
import list from './pages/list.vue'
import map from './pages/map.vue'
import detail from './pages/detail.vue'

export default [
  {
    path: '/foci',
    component: front_page,
    name: 'foci',
    meta: {
      can: 'read foci',
      fail: '/meta/home'
    }
  },
  {
    path: '/foci/list',
    component: list,
    name: 'foci:list',
    meta: {
      can: 'read foci',
      fail: '/meta/home'
    }
  },
  {
    path: '/foci/map',
    component: map,
    name: 'foci:map',
    meta: {
      can: 'read foci',
      fail: '/meta/home'
    }
  },
  {
    path: '/foci/detail/:foci_id',
    component: detail,
    props: true,
    name: 'foci:detail',
    meta: {
      can: 'read foci',
      fail: '/meta/home'
    }
  }
]