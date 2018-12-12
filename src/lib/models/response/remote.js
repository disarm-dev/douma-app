import {request_handler} from "lib/remote/request-handler"

export default {read_all, read_new, create}

function read_new(last_id) {
  const request = _read_new(last_id)
  return request_handler(request)
}

function _read_new(last_id) {
  return {
    url: '/record/updates',
    timeout: 20000,
    method: 'post',
    data: {last_id: last_id}
  }
}

function read_all() {
  const request = _read_all()
  return request_handler(request)
}

function _read_all() {
  return {
    url: '/record/all',
  }
}


function create(responses) {
  const request = _create(responses)
  return request_handler(request)
}

function _create(responses) {
  if (!responses.length) return false

  return {
    url: '/record/create',
    timeout: 20000,
    method: 'post',
    data: responses
  }
}


