function watch_positions_for(duration_ms, options) {
  return new Promise((resolve) => {
    let watch_id
    const result = {
      errors: [],
      positions: []
    }

    setTimeout(() => {
      navigator.geolocation.clearWatch(watch_id)
      resolve(result)
    }, duration_ms) // total duration to watch for

    watch_id = navigator.geolocation.watchPosition((position) => {
        result.positions.push(position)
      },
      (error) => {
        result.errors.push(error)
      },
      options
    )
  })
}

export async function get_current_coordinates() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000, // each position get should take no longer than this
    maximumAge: 2000
  }

  const {errors, positions} = await watch_positions_for(6000, options)
  return determine_response(positions, errors)
}

export function determine_response(positions, errors) {
  return new Promise((resolve, reject) => {
    if (positions.length > 0) {
      // If we have more than one position then return the position with the lowest accuracy value (the most accurate position).
      const position_with_highest_accuracy = positions.reduce((highest_accuracy, position) => {
        if (position.coords.accuracy < highest_accuracy.coords.accuracy) {
          highest_accuracy = position
        }
        return highest_accuracy
      })

      resolve(position_with_highest_accuracy)
    } else {
      // navigator.geolocation.clearWatch might return before there is an error or a result
      const latest_error = errors[errors.length - 1] || {code: 'watch-timeout', message: 'GPS timeout'}
      reject(latest_error)
    }
  })
}