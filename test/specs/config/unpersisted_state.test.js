import test from 'ava'

import {generate_unpersisted_state} from 'config/vuex-persistedstate_options'

test('can create unpersisted_state object with instance stores of zero length', t => {
  const actual = generate_unpersisted_state([])

  t.is(actual.length, 2) // includes couple of root-store bits we want to ignore
})


test('can create unpersisted_state object from a single store', t => {
  const store = {
    unpersisted_state_keys: ['thing'],
    state: {
      thing: 'what'
    }
  }

  const actual = generate_unpersisted_state([store])

  t.is(actual.length, 3) // includes couple of root-store bits we want to ignore
  t.is(actual[2].store_path, '0.thing')
  t.is(actual[2].default_value, 'what')
})
