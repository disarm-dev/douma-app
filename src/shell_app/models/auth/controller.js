import Remote from './remote'

async function login({username, password}, store) {
  const res = await Remote.login({username, password})

  const dummy_user = {
    '_id': 'dev2',
    'name': 'Dummy',
    'username': 'du',
    'key': 'b48fbf5e746e6bfbd6c36dca5ff088b3',
  }

  console.log('login res', res)
}

export default {
  login,
}