import pubsubcache from 'lib/helpers/pubsubcache'

export function configure_pubsubcache_listeners(store) {
  pubsubcache.subscribe('sw:show_update_downloading', e => {
    store.commit('root:set_sw_update_downloading', true)
  })

  pubsubcache.subscribe('sw:show_update_available', e => {
    store.commit('root:set_sw_update_available', true)
  })

  pubsubcache.subscribe('sw:show_content_available_offline', e => {
    store.commit('root:set_sw_message', {
      title: 'Offline mode ready',
      message: 'After you are logged in and have downloaded the geodata, the app will work offline'
    })
  })
}