import Remote from './remote'

async function login({username, password}, store) {
  return await Remote.login({username, password})
}

export default {
  login,
}