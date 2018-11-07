import CONFIG from 'config/common'

export function get_api_url() {
  const protocol = CONFIG.api.protocol
  const host = location.hostname
  const port = CONFIG.api.port
  const version = CONFIG.api.version

  return `${protocol}://${host}:${port}/${version}`
}