import mapboxgl from 'mapbox-gl'
import CONFIG from 'config/common'

mapboxgl.accessToken = CONFIG.basemap.map_token

/**
 * Create a basic mapbox-gl map
 * @param {$store} [store] - Used to set error/loading messages
 * @returns {mapboxgl.Map}
 */
const basic_map = (store) => {
  const map = new mapboxgl.Map({
    container: 'map',
    style: CONFIG.basemap.default.style,
    center: CONFIG.basemap.default.coords,
    zoom: CONFIG.basemap.default.zoom
  })

  // disable zooming with mouse scroll. now you can scroll
  map.scrollZoom.disable()

  // catch basic errors
  map.on('error', (e) => {
    console.warn('🗺 Basic map error:', e)
    if (e.error) console.log(e.error)
    if (store) store.commit('root:set_snackbar', {message: 'Problem with map data'})
  })

  // not sure
  map.addControl(new mapboxgl.NavigationControl())

  return map
}

export {basic_map}
