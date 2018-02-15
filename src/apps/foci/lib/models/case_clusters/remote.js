import {request_handler} from "lib/remote/request-handler"

export default { read_all, update, read_count}

async function read_all() {
  const request = _read_all()
  return request_handler(request)

  // const res = await fetch('/static/case_clusters.json')
  // const case_clusters = await res.json()
  // return case_clusters
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

async function read_count() {
  const request = _read_count()
  return request_handler(request)
}

function _read_count() {
  return {
    url_suffix: 'foci/number_of_clusters'
  }
}
