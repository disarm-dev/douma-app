import axios from 'axios/index'

export const shell_axios = axios.create({
  baseURL: 'http://localhost:3000/v1',
  timeout: 10000,
  headers: {
    // Can set later after login
  }
})

export function add_token_to_headers(token) {
  return axios.defaults.headers.Authorization = `Bearer ${token}`
}