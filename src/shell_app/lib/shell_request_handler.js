import axios from 'axios/index'
import CONFIG from 'config/common'

const api_url = `http://localhost:3000`//"https://config-server-stage.herokuapp.com"

export const shell_axios = axios.create({
  baseURL: api_url,
  timeout: 10000,
  params: { 
    country: 'all', 
  },
})

export function add_token_to_headers(token) {
  axios.defaults.headers = { 'API-key': token }
}
