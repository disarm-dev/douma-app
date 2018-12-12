import CONFIG from 'config/common'

export function get_api_url() {
  const host = location.hostname
  const production_host = host.replace('app', 'api')
  const dev_url = CONFIG.api.dev_url
  const version = CONFIG.api.version

  let url = 'https://demo-editor-server.herokuapp.com/v8'
  /*if (__DOUMA_PRODUCTION_MODE) {
    url = `https://${production_host}/${version}`
  } else {
    url = `${dev_url}/${version}`
  }*/

  return url

}
