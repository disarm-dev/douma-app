import record from './pages/record.vue'
import list from './pages/list.vue'
import view_response from './pages/view_response.vue'

export default [
  {
    path: '/irs/record_point',
    redirect: '/irs/record_point/list',
    name: 'irs_record_point',
    meta: {
     can: 'read irs_record_point',
     fail: '/meta/home'
    }
  },{
    path: '/irs/record_point/list',
    component: list,
    name: 'irs_record_point:list',
    meta: {
      can: 'read irs_record_point',
      fail: '/meta/home'
    }
  },{
    path: '/irs/record_point/new',
    component: record,
    name: 'irs_record_point:new',
    meta: {
      can: 'write irs_record_point',
      fail: '/meta/home'
    }
  },{
    path: '/irs/record_point/edit/:response_id',
    props: true,
    component: record,
    name: 'irs_record_point:edit',
    meta: {
      can: 'write irs_record_point',
      fail: '/meta/home'
    }
  },{
    path: '/irs/record_point/view/:response_id',
    props: true,
    component: view_response,
    name: 'irs_record_point:view',
    meta: {
      can: 'read irs_record_point',
      fail: '/meta/home'
    }
  }
]
