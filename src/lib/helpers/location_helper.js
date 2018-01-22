import objectify from 'geoposition-to-object'


export function get_current_position(options) {
  if (!'geolocation' in navigator) return

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
        resolve(objectify(position))
      }, (error) => reject(error),
      options)
  })
}

export function watch_current_position(options, callback, errorCallback) {
  if (!'geolocation' in navigator) return

  const watch_id = navigator.geolocation.watchPosition((position) => {
      callback(position)
    }, (error) => errorCallback(error),
    options)

  return watch_id
}

export function clear_watch(watch_id) {
  if (!'geolocation' in navigator) return
  return navigator.geolocation.clearWatch(watch_id)
}