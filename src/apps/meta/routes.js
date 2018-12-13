import applet from './applet.vue'
import home from './pages/home.vue'
import logout from './pages/logout.vue'
import clear_data from './pages/clear_data.vue'

export default [
  {
    path: '/meta',
    component: applet,
    redirect: '/meta/home',
    name: 'meta',
    children: [
      {
        path: 'home',
        name: 'meta:home',
        component: home,
        meta: {title: 'Home'}
      },{
        path: 'logout',
        name: 'meta:logout',
        component: logout,
      },{
        path: 'clear_data',
        name: 'meta:clear_data',
        component: clear_data,
      }
    ]
  }
]
