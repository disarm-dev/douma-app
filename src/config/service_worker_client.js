import pubsubcache from 'lib/helpers/pubsubcache'

import BUILD_TIME from 'config/build-time'

//
// SERVICE WORKER
//

export function configure_service_worker () {
  if (!BUILD_TIME.DOUMA_PRODUCTION_MODE) {
    console.warn("DOUMA ServiceWorker disabled in development")
    return Promise.resolve()
  }

  if (!('serviceWorker' in navigator)) {
    console.log('ServiceWorker not available in this browser')
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {

        // parsed, installing, installed, activating, activated, and redundant
        registration.onupdatefound = () => {
          var installingWorker = registration.installing

          installingWorker.onstatechange = () => {
            pubsubcache.publish('service_worker/onstatechange', installingWorker.state)
          }
        }
        resolve()
      }).catch(e => {
        console.error(e)
        reject(e)
      })
  })
}
