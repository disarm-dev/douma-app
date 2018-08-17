import axios from 'axios/index'
import CONFIG from 'config/common'

export const shell_axios = axios.create({
  baseURL: CONFIG.api.url + '/' + CONFIG.api.version,
  timeout: 10000,
  headers: { 'API-Key': '' },
  params: { 
    country: 'all', 
  },
})

export function add_token_to_headers(token) {
  axios.defaults.headers = { 'API-Key': token }
}