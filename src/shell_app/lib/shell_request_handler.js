import axios from 'axios/index'

let axios_instance
let auth_axios_instance

export function shell_request_handler() {
  axios_instance = axios.create()

  // Defaults
  axios_instance.defaults.timeout = 10000

  return axios_instance
}


export function shell_auth_request_handler(token) {
  return axios.create({
    base_URL: 'http://localhost:3000',
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${localStorage.token}`
    }
  })
}