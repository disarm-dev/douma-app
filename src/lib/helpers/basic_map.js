import mapboxgl from 'mapbox-gl'
import CONFIG from 'config/common'
import cache from 'config/cache'
import {__is_a_demo, add_boundary_polygon, demo_map_config} from 'config/demo_config'

const map_config = () => {
  return !__is_a_demo ? CONFIG.basemap.default : demo_map_config
}

/**
 * Create a basic mapbox-gl map
 * @param {$store} [store] - Used to set error/loading messages
 * @returns {mapboxgl.Map}
 */
const basic_map = (store) => {
  mapboxgl.accessToken = map_config().map_token

  const map = new mapboxgl.Map({
    container: 'map',
    style: map_config().style,
    center: map_config().coords,
    zoom: map_config().zoom
  })

  // disable zooming with mouse scroll. now you can scroll
  map.scrollZoom.disable()

  // catch basic errors
  map.on('error', (e) => {
    console.warn('🗺 Basic map error:', e)
    if (e.error) console.log(e.error)
    if (store) store.commit('root:set_snackbar', {message: 'Problem with map data'})
  })

  if (__is_a_demo) {
    add_boundary_polygon(map)
  }

  // not sure
  map.addControl(new mapboxgl.NavigationControl())

  return map
}

export {basic_map}

function create_boundary_polygon() {
  const geojson = cache.geodata
}