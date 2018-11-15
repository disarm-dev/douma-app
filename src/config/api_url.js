import CONFIG from 'config/common'

export function get_api_url() {
  const protocol = location.protocol
  const host = location.hostname
  const production_host = `api.${host}`
  const dev_port = CONFIG.api.dev_port
  const version = CONFIG.api.version

  if (__DOUMA_PRODUCTION_MODE) {
    return `https://${production_host}/${version}`
  } else {
    return `${protocol}://${host}:${dev_port}/${version}`
  }

}