import axios from 'axios/index'
import BUILD_TIME from 'config/build-time'

export const shell_axios = axios.create({
  // baseURL: 'http://localhost:3000/v1',
  baseURL: BUILD_TIME.BRANCH === 'master' ? 'https://douma.api.disarm.io/v7' : 'https://douma-stage.api.disarm.io/v7',
  timeout: 10000,
  headers: { 'API-Key': '' },
  params: { 
    country: 'all', 
  },
})

export function add_token_to_headers(token) {
  axios.defaults.headers = { 'API-Key': token }
}