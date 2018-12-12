import axios from 'axios/index'
import {get_api_url} from 'config/api_url'

export const shell_axios = axios.create({
  baseURL: get_api_url(),
  timeout: 10000,
})

export function add_token_to_headers(token) {
  axios.defaults.headers = { 'API-Key': token }
}
