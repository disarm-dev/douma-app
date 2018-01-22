import test from 'ava'

import {create_options} from 'config/vuex-persistedstate_options'

test('cannot create options without an unpersisted_state object', t => {
  const error = t.throws(() => {
    create_options()
  })

  t.is(error.message, 'unpersisted_state object required')
})

test('can create options with an empty unpersisted_state object (all stores keep everything persisted)', t => {
  t.notThrows(() => {
    create_options([])
  })
})



