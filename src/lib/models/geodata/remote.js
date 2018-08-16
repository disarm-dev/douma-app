import {merge} from 'lodash'

import {request_handler} from 'lib/remote/request-handler.js'
import {get_all_spatial_hierarchy_level_names, get_slug, get_data_version} from 'lib/instance_data/spatial_hierarchy_helper'
import {save_geodata_to_idb} from 'lib/models/geodata/local.geodata_store'

/**
 * Simple string-interpolation to generate a URL
 * @param slug
 * @param level_name
 * @returns {string}
 */
function geodata_url_for(level_name) {
  const slug = get_slug()
  return `/geodata/${slug}/${level_name}`
}

function get_geodata_for(level_name) {
  const request = _get_geodata_for(level_name)
  return request_handler(request)
}

function _get_geodata_for(level_name) {
  const data_version = get_data_version()

  const url_suffix = geodata_url_for(level_name)

  return {
    url_suffix,
    timeout: 300000,
    params: {
      data_version
    },
    data: {
      level_name
    }
  }
}

function store_geodata({ level_name, level_geodata, instance_slug}) {
  return save_geodata_to_idb({level_name, level_geodata, instance_slug})
}

/**
 * retrieve from remote and store on IndexedDB
 * @param level_name
 */
export function get_and_store_locally_geodata_for(level_name, instance_slug) {
  return get_geodata_for(level_name)
    .then((response) => {
      const level_geodata = response.geodata_data
      return store_geodata({level_name, level_geodata, instance_slug})
    })
}

export function get_and_set_all_geodata() {
  const levels = get_all_spatial_hierarchy_level_names()

  const promises = levels.map(get_and_set_all_geodata)

  return Promise.all(promises)
}
