import remote from './remote'
import local from './local'

export {read_all_network, read_all_cache, create_batch_network}

async function read_all_network() {
  // get them from remote
  const remote_responses = await remote.read_all()

  // validate and report on errors
  // const valid_responses = validate_responses(remote_responses)

  // decorate as needed (static/by-hand and decorations.json)
  // const decorated_records = decorate_responses(validate_responses)

  // populate local DB
  // await local.create(remote_responses)

  // return them
  return remote_responses
}


async function read_all_cache() {
  // return await local.read_all()
  return console.warn('noop')
}


async function create_batch_network(responses) {
  return await remote.create(responses)
}