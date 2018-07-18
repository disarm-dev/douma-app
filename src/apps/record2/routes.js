import applet from './applet'
import list from './pages/list'
import create_or_update from './pages/create_or_update'
import show from './pages/show'

export default [
  {
    path: '/irs/record2',
    component: applet,
    name: 'record2',
    meta: {
      can: 'read record2',
      fail: '/meta/home'
    }
  }, {
    path: '/irs/record2/list',
    component: list,
    name: 'record2:list',
    meta: {
      can: 'read record2',
      fail: '/meta/home'
    }
  }, {
    path: '/irs/record2/create',
    component: create_or_update,
    name: 'record2:create',
    meta: {
      can: 'write record2',
      fail: '/meta/home'
    }
  }, {
    path: '/irs/record2/update/:response_model',
    props: true,
    component: create_or_update,
    name: 'record2:update',
    meta: {
      can: 'write record2',
      fail: '/meta/home'
    }
  }, {
    path: '/irs/record2/show',
    props: true,
    component: show,
    name: 'record2:show',
    meta: {
      can: 'read record2',
      fail: '/meta/home'
    }
  }
]
