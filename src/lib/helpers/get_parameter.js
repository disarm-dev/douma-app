import COMMON from 'config/common';
import {persist_shell_data, retrieve} from 'shell_app/lib/shell_data'

const find_get_parameter = (parameterName) => {
  let result = null;
  let tmp = [];

  location.search
    .substr(1)
    .split('&')
    .forEach((item) => {
      tmp = item.split('=');
      if (tmp[0] === parameterName) { result = decodeURIComponent(tmp[1]); }
    });
  return result;
};


// If we pass a store, we stick in the store,
// otherwise we stick in the persisted localStorage
const api_url_from_query_param = () => {
  const query_param = COMMON.api.query_parameter;
  const found = find_get_parameter(query_param);

  if (found) {
    persist_shell_data('api-key', found)
    return true
  } else {
    return false
  }
};


export const get_api_url = () => {
  // Check if query param
  const from_query_param = api_url_from_query_param()
  if (from_query_param) return from_query_param

  // Check if previously persisted to localStorage
  const from_localStorage = retrieve('api_url')
  if (from_localStorage) return from_localStorage

  // Return default
  return COMMON.api.default_url;
}
