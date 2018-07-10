import pubsubcache from 'lib/helpers/pubsubcache'

export const configure_pubsub_converters = () => {
  document.addEventListener('show-update-downloading', e => {
    pubsubcache.publish('sw:show_update_downloading')
  })

  document.addEventListener('show-update-available', e => {
    pubsubcache.publish('sw:show_update_available')
  })

  document.addEventListener('show-content-available-offline', e => {
    pubsubcache.publish('sw:show_content_available_offline')
  })
}