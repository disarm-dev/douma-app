import CONFIG from 'config/common'
import {config_axios_instance} from 'lib/remote/axios_instance'
import {get_api_url} from 'config/api_url'
import {store} from 'apps/store'

/**
 * Standard request handler for all remote requests (currently both client server and API)
 * Passed options overwrite any default options.
 * @param request_config
 */
export function request_handler(request_config) {

  if (!request_config) return Promise.reject(new Error("request is empty"))

  // If a `request.url` is not already provided, will create one
  // to send request to API server
  if (!request_config.url) {
    if (!request_config.url_suffix && request_config.url_suffix !== '') throw new Error("Missing `url_suffix` on request")

    // Get API URL - either from localStorage or the default from CONFIG
    const api_url = get_api_url()

    const douma_api_root = `${api_url}/${CONFIG.api.version}`
    request_config.url = douma_api_root + request_config.url_suffix
  }

  const axios_instance = config_axios_instance()

  return axios_instance(request_config)
    .then(json => json.data)
    .catch(err => {
      // Any route other than login which receives 401 needs to tell user
      if (request_config.url_suffix !== '/login' && err.response && err.response.status === 401) {
        const message = err.response.data.message
        store.commit('root:set_snackbar', {message})
      }
      throw err
    })
}



