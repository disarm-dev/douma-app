import pubsubcache from 'lib/helpers/pubsubcache'

export const configure_pubsub_listeners = () => {
  document.addEventListener('show-update-downloading', e => {
    pubsubcache.publish('sw:show-update-downloading')
  })

  document.addEventListener('show-update-available', e => {
    pubsubcache.publish('sw:show-update-available')
  })

  document.addEventListener("show-content-available-offline", e => {
    pubsubcache.publish('sw:show-content-available-offline')
  })
}