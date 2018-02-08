import {request_handler} from "lib/remote/request-handler"

export default {read_all, update}

async function read_all() {
  // TODO: replace with request handler when server is deployed and has endpoints
  // const request = _read_all()
  // return request_handler(request)


  const result = await fetch('/static/case_clusters.json').then(res => res.json())
  return result
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

