import foci_applet from './pages/applet.vue'
import status_page from './pages/status.vue'
import front_page from './pages/front_page.vue'
import list from './pages/list.vue'
import map from './pages/map.vue'
import detail from './pages/detail.vue'

export default [
  {
    path: '/foci',
    name: 'foci',
    redirect: {name: 'foci:front'},
    component: foci_applet,
    children: [
      {
        path: 'front',
        component: front_page,
        name: 'foci:front',
        meta: {
          can: 'read foci',
          fail: '/meta/home'
        }
      },
      {
        path: 'status',
        component: status_page,
        name: 'foci:status',
        meta: {
          can: 'read foci',
          fail: '/meta/home'
        }
      },
      {
        path: 'list',
        component: list,
        name: 'foci:list',
        meta: {
          can: 'read foci',
          fail: '/meta/home'
        }
      },
      {
        path: 'map',
        component: map,
        name: 'foci:map',
        meta: {
          can: 'read foci',
          fail: '/meta/home'
        }
      },
      {
        path: 'detail/:foci_id',
        component: detail,
        props: true,
        name: 'foci:detail',
        meta: {
          can: 'read foci',
          fail: '/meta/home'
        }
      }
    ]
  }
]