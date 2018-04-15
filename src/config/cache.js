const cache = {
}

// e.g. clusters: null // FeatureCollection
Object.defineProperty(cache, 'geodata', {
  get: function () {
    console.trace('get geodata')
    return this._geodata
  },
  set: function (val) {
    this._geodata = val
  }
})

// TODO: @debug Remove this global when we no longer need our training wheels
window.__disarm_debug_cache = cache

export default cache
