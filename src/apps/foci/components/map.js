import CONFIG from 'config/common'

import uuid from 'uuid/v4'

// This is mostly copied from 'lib/helpers/basic_map'
// It's been duplicated in order to experiment with a new approach to composing maps

export function render_map(map_container_id) {
  // TODO: Fix this
  // Need to require as an import will break the tests....
  const mapboxgl = require('mapbox-gl')

  return new Promise((resolve) => {

    const map = new mapboxgl.Map({
      container: map_container_id,
      style: CONFIG.basemap.default.style,
      center: CONFIG.basemap.default.coords,
      zoom: CONFIG.basemap.default.zoom
    })
    
    // disable zooming with mouse scroll. now you can scroll
    map.scrollZoom.disable()
    
    map.on('error', (e) => {
      console.warn('🗺 Basic map error:', e)
      if (e.error) console.log(e.error)
      // TODO: handle errors better
    })
    
    map.addControl(new mapboxgl.NavigationControl())
    
    map.on('load', () => {
      resolve(map)  
    }) 
  })
}

export function add_polygon_layer(map, feature_collection) {
  // Could check if feature collection has points, or polygons
  // Then we only need one function
  const id = uuid()

  map.addLayer({
    id: id,
    type: 'fill',
    source: {
      type: 'geojson',
      data: feature_collection
    },
    paint: {
      'fill-opacity': 0.2,
    //   'fill-color': {
    //     property: layer_string,
    //     stops: palette
    //   },
    //   'fill-outline-color': 'black'
    }
  })
  return id
}