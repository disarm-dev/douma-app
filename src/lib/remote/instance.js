import {request_handler} from './request-handler.js'
import stripJsonComments from 'strip-json-comments'
/**
 * Get single instance file (currently from client server)
 * @param slug
 * @param type
 */
export const get_instance_file = (slug, type) => {
  if (!slug || !type) throw new Error(`Need both slug (${slug}) and type (${type}) to get an instance file`)

  const url = `/static/instances/${slug}/config/${slug}.${type}.json`
  // const url = `https://storage.googleapis.com/disarm-instance-config/${slug}/config/${slug}.${type}.json`

  let options = {
    url,
    timeout: 20000,
    transformResponse(data) {
      return JSON.parse(stripJsonComments(data))
    }
  }
  return request_handler(options)

}
