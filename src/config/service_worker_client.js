import BUILD_TIME from 'config/build-time'

if (!BUILD_TIME.DOUMA_PRODUCTION_MODE) {
  console.warn('DOUMA ServiceWorker disabled in development')
}

if (!('serviceWorker' in navigator)) {
  console.log('ServiceWorker not available in this browser')
}

navigator.serviceWorker.register('/service-worker.js')
  .then((registration) => {
    const installingWorker = registration.installing

    // starting install
    if (installingWorker) {
      console.log('[sw] start registration.installing')
      installingWorker.addEventListener('statechange', function (e) {
        console.log(`[sw] ${e.target.state}`)
      })
    }
})


