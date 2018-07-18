import axios from 'axios/index'

export const shell_axios = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    Authorization: 'Bearer' // Can set later after login
  }
})
