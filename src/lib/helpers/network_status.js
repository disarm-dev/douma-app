export function add_network_status_watcher (douma_app) {
  function set_online() {
    return douma_app.$store.commit('root:network_online', true)
  }

  function set_offline() {
    return douma_app.$store.commit('root:network_online', false)
  }

  window.addEventListener('online', set_online)
  window.addEventListener('offline', set_offline)

  douma_app.$store.commit('root:network_online', navigator.onLine)
}

