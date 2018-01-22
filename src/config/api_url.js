import {get} from 'lodash'

import CONFIG from 'config/common'
import {retrieve_stored_param} from 'lib/helpers/hash_params'
import {store} from 'apps/store'

export function get_api_url() {
  if (store && get(store, 'state.instance_config.instance.customisable_api_url')) {
    return retrieve_stored_param(CONFIG.hash_params.API_URL) || CONFIG.api.url
  } else {
    return CONFIG.api.url
  }

}