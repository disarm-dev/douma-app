import axios from 'axios'

import {get} from 'lodash'
import {store} from 'apps/store'


export {config_axios_instance}
/**
 *
 * @returns {AxiosInstance}
 */
function config_axios_instance() {
  const instance = axios.create()

  // Defaults
  instance.defaults.timeout = 10000

  // Default params
  const personalised_instance_id = get(store, 'state.meta.personalised_instance_id')
  const country = get(store, 'state.instance_config.instance.slug')
  const user = get(store, 'state.user.username')
  const api_key = get(store, 'state.meta.user.key')

  instance.defaults.params = {
    personalised_instance_id,
    country,
    instance_slug: country, // TODO: @refac remove 'country' property
    user
  }

  instance.defaults.headers = {
    'API-Key': api_key
  }


    // Interceptors for network monitoring
  instance.interceptors.response.use(function (response) {
    window.dispatchEvent(new Event('online'))
    return response
  }, function (error) {
    if (/timeout/.test(error.message)) {
      window.dispatchEvent(new Event('offline'))
    }
    return Promise.reject(error)
  })


  return instance
}

