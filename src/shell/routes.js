import AppletRoot from './components/applet_root'
import Login from './components/login'
import Logout from './components/logout'
import SelectInstance from './components/select_instance'
import Thing from './components/thing'

export default [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/logout',
    component: Logout
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/load_instance',
    component: SelectInstance
  },
  {
    path: '/:config_id/',
    component: AppletRoot,
    props: true,
    children: [
      {
        path: 'thing',
        component: Thing
      }
    ]
  },
]
