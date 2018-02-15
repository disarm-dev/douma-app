import {request_handler} from "lib/remote/request-handler"

export default { read_all, read_count}

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

async function read_count() {
  const request = _read_count()
  return request_handler(request)
}

function _read_count() {
  return {
    url_suffix: '/foci/number_of_cases'
  }
}