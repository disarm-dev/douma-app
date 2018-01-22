import CONFIG from 'config/common'

// on startup
// look for all hash params from hash, based on config/common values
// store anything you find using the config/common keys, with "DOUMA_HASH_" prefix
// return object of config/common keys and the matching hash_params

export function store_params_from_hash() {
  let result = {}
  const param_keys = Object.values(CONFIG.hash_params)

  param_keys.forEach(key => {
    const value = get_hash_value(key)
    if (value) {
      store_param(key, value)
      result[key] = value
    }
  })
  return result
}

function get_hash_value(key) {
  const matches = location.hash.match(new RegExp(key+'=([^&]*)'));
  return matches ? matches[1] : null;
}


export function store_param(key, value) {
  const localStorage_key = key_to_localStorage_key(key)
  return localStorage.setItem(localStorage_key, value)
}

// take a config/common key and return hash_param if found in localStorage
export function retrieve_stored_param(key) {
  const localStorage_key = key_to_localStorage_key(key)
  return localStorage.getItem(localStorage_key)
}

export function remove_param(key) {
  const localStorage_key = key_to_localStorage_key(key)
  return localStorage.removeItem(localStorage_key)
}

function key_to_localStorage_key(key) {
  return `DOUMA_HASH_${key}`
}