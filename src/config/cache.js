const cache = {
  geodata: {}, // e.g. clusters: null // FeatureCollection
  location_selection: {} // Array
}

// TODO: @debug Remove this global when we no longer need our training wheels
window.__disarm_debug_cache = cache

export default cache
