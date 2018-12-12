import axios from 'axios/index'
import {get, merge} from 'lodash'
import {store} from 'shell_app/lib/launch_shell_app'

export const shell_axios = (incoming_options) => {
  const api_url = get(store, 'state.api_url')
  const api_key = get(store, 'state.user.key', '')
  const instance_id = get(store, 'state.instance_config.instance_id', '')

  const default_options = {
    headers: {
      'API-Key': api_key,
    },
    baseURL: api_url,
    params: {
      instance_id,
    }
  };
  const merged = merge(default_options, incoming_options);

  return axios(merged);
}
}
