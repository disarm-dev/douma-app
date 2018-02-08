import {request_handler} from "lib/remote/request-handler"

export default {read_all, update}

async function read_all() {
  const request = _read_all()
  return request_handler(request)
}

function _read_all() {
  return {
    url_suffix: '/foci/cluster'
  }
}

async function update(case_cluster) {
  const request = _update(case_cluster)
  return request_handler(request)
}

function _update(case_cluster) {
  return {
    method: 'PUT',
    url_suffix: '/foci/cluster',
    data: case_cluster
  }
}

