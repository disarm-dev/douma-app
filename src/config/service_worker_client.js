import pubsubcache from 'lib/helpers/pubsubcache'

import BUILD_TIME from 'config/build-time'

//
// SERVICE WORKER
//
if (!BUILD_TIME.DOUMA_PRODUCTION_MODE) {
  console.warn('DOUMA ServiceWorker disabled in development')
}

if (!('serviceWorker' in navigator)) {
  console.log('ServiceWorker not available in this browser')
}

navigator.serviceWorker.register('/service-worker.js')
  .then((registration) => {

    if (registration.installing) {
      registration.installing.addEventListener('statechange', function (e) {
        pubsubcache.publish('registration.installing.onstatechange', e.target.state);
      })
    }

    // parsed, installing, installed, activating, activated, and redundant
    registration.onupdatefound = () => {
      var installingWorker = registration.installing

      installingWorker.onstatechange = () => {
        pubsubcache.publish('service_worker/onupdatefound/onstatechange', installingWorker.state)
      }
    }
})


