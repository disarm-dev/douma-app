import localidad_geodata from '../demo-app.localidad.geojson'

const cache = {
  geodata: {
    localidad: localidad_geodata
  },
}
// TODO: @debug Remove this global when we no longer need our training wheels
window.__disarm_debug_cache = cache

export default cache
