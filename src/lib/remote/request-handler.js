import {store} from 'apps/store'
import axios from 'axios'

const default_options = () => {
  const api_url = get(store, 'state.api_url')
  const personalised_instance_id = get(store, 'state.meta.personalised_instance_id')
  const user = get(store, 'state.user.username')
  const instance_id = get(store, 'state.instance_config.instance_id')
  const api_key = get(store, 'state.meta.user.key')

  return {
    baseURL: api_url,
    timeout: 10000,
    params: {
      personalised_instance_id,
      user,
      instance_id,
    },
    headers: {
      'API-Key': api_key,
    }
  }
}


export const request_handler = async (incoming_options) => {
  const merged = merge(default_options(), incoming_options);

  // Interceptors for online/offline notification
  axios.interceptors.response.use(function (response) {
    window.dispatchEvent(new Event('online'))
    return response
  }, function (error) {
    if (/timeout/.test(error.message)) {
      window.dispatchEvent(new Event('offline'))
    }
    return Promise.reject(error)
  })

  // Execute the request and handle failures with an error snackbar
  try {
    const res = await axios(merged);
    return res.data;
  } catch(err) {
    if (incoming_options.url_suffix !== '/login' && err.response && err.response.status === 401) {
      const message = err.response.data.message
      store.commit('root:set_snackbar', {message})
    }
    throw err
  }
}

