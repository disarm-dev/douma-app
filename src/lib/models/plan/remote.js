import {request_handler} from 'lib/remote/request-handler'

export default {read_plan_current, create_plan}

// PLANS
function read_plan_current() {
  const request = _read_plan_current()
  return request_handler(request)
}

function _read_plan_current() {
  return {
    url_suffix: '/plan/current',
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

