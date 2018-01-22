import {get_instance_files} from 'lib/instance_data/extend_instance_config'
import CONFIG from 'config/common'
import {remove_param, retrieve_stored_param, store_params_from_hash} from 'lib/helpers/hash_params'

function get_subdomain_if_not_local() {
  const domain = document.domain
  const possible_subdomain = document.domain.split('.')[0]

  // Is 'localhost' - this isn't a subdomain
  if (['localhost'].includes(domain)) return false
  // Subdomain only contains numbers - unlikely to be one of ours
  if(/^[0-9]*$/.test(possible_subdomain)) return false

  return document.domain.split('.')[0]
}
/**
 * Order of checking:
 * - is in an explicit `#instance=nam` hash param on URL
 * - looks like a subdomain (not a number or 'localhost')
 * - neither of the above, but already something found in localStorage
 * - nothing. error
 * @returns String {instance_slug}
 */
function determine_instance() {
  let instance_slug = null

  const hash_params = store_params_from_hash() // Only called once, on startup

  const instance_hash = hash_params[CONFIG.hash_params.INSTANCE_ID]
  const subdomain = get_subdomain_if_not_local()
  const instance_localStorage = retrieve_stored_param(CONFIG.hash_params.INSTANCE_ID)

  if (subdomain && is_valid_subdomain(subdomain)) {
    instance_slug = subdomain
    remove_param(CONFIG.hash_params.INSTANCE_ID)
  } else if (instance_hash && is_valid_subdomain(instance_hash)) {
    instance_slug = instance_hash
  } else if (instance_localStorage && is_valid_subdomain(instance_localStorage)) {
    instance_slug = instance_localStorage
  } else {
    const msg = `You might be looking for an application which does not exist. Cannot find instance id in subdomain or hash ('#instance=xxx'). `
    alert(msg)
    throw new Error(msg)
  }
  return instance_slug
}


function is_valid_subdomain(subdomain) {
  if(CONFIG.instances.list.includes(subdomain)) {
    return true
  } else {
    console.error(`Invalid subdomain: ${subdomain}`)
    return false
  }
}

/**
 * @returns Promise
 */
export function get_instance_config(hash_params) {
  const instance_slug = determine_instance()

  return get_instance_files(instance_slug)
    .then(res => {
      if (res.status === 404) {
        const msg = `You might be looking for an application which does not exist. Cannot find application configuration file for subdomain "${instance_slug}". `
        alert(msg)
        return new Error(msg)
      }
      return res
    })
}
