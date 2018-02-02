// import {request_handler} from "lib/remote/request-handler"

export default {read_all}

function read_all() {
  // TODO: replace with request handler when server is deployed and has endpoints
  // const request = _read_all()
  // return request_handler(request)


  return fetch('/static/cases.geojson').then(res => res.json)
}

// TOOD: fix url and use same pattern
function _read_all() {
  return {
    url_suffix: '/record/all',
  }
}

