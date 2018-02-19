import {request_handler} from "lib/remote/request-handler"

export default { read_all, read_count}

async function read_all() {
  const request = _read_all()
  return request_handler(request)
}

function _read_all() {
  return {
    url_suffix: '/foci/case_locations',
  }
}

async function read_count() {
  const request = _read_count()
  return request_handler(request)
}

function _read_count() {
  return {
    url_suffix: '/foci/number_of_case_locations'
  }
}