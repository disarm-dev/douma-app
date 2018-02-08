// import {request_handler} from "lib/remote/request-handler"

export default {read_all}

async function read_all() {
  // TODO: replace with request handler when server is deployed and has endpoints
  // const request = _read_all()
  // return request_handler(request)


  const result = await fetch('/static/cases.json').then(res => res.json())
  return result
}

function _read_all() {
  return {
    url_suffix: '/foci/cases',
  }
}

