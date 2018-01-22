import remote from './remote'

export {authenticate}

async function authenticate(user) {
  return await remote.authenticate(user)
}