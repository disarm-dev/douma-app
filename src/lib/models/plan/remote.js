import {request_handler} from 'lib/remote/request-handler'

export default {read_plan_current, create_plan, read_plan_list, read_plan_detail, update_plan, delete_plan}

// PLANS
function read_plan_current() {
  const request = _read_plan_current()
  return request_handler(request)
}

function read_plan_detail(plan_id) {
  const request = _read_plan_detail(plan_id)
  return request_handler(request)
}

function read_plan_list() {
  const request = _read_plan_list()
  return request_handler(request)
}

function _read_plan_current() {
  return {
    url_suffix: '/plan/current',
    timeout: 10000
  }
}

function _read_plan_detail(plan_id) {
  return {
    url_suffix: `/plan/detail/${plan_id}`,
    timeout: 10000
  }
}

function _read_plan_list() {
  return {
    url_suffix: '/plan/list',
    timeout: 10000
  }
}


function create_plan(plan) {
  const request = _create_plan(plan)
  return request_handler(request)
}

function _create_plan(plan) {
  return {
    url_suffix: '/plan/create',
    data: plan,
    method: 'post',
    timeout: 10000
  }
}

function update_plan({plan,_id}){
  const request = _update_plan({plan,_id})
  return request_handler(request)
}

function _update_plan({plan,_id}) {
  return {
    url_suffix: `/plan/${_id}`,
    data: plan,
    method: 'put',
    timeout: 10000
  }
}



function delete_plan(plan){
  const request = _delete_plan(plan)
  return request_handler(request)
}

function _delete_plan(plan) {
  return {
    url_suffix: `/plan/${plan}`,
    method: 'delete',
    timeout: 10000
  }
}

