import CONFIG from 'config/common'

export function get_api_url() {
  const protocol = CONFIG.api.protocol
  const host = location.hostname
  const production_host = `api.${host}`
  const port = CONFIG.api.port
  const version = CONFIG.api.version

  if (__DOUMA_PRODUCTION_MODE) {
    return `${protocol}://${production_host}/${version}`
  } else {
    return `${protocol}://${host}:${port}/${version}`
  }

}