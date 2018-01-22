import test from 'ava'
import {set} from 'lodash'

import Login from 'apps/meta/pages/login.vue'

test('redirects to single component', t => {
  const allowed_read = ['example_applet']

  const _this = set({}, '$store.state.meta.user.allowed_apps.read', allowed_read)

  const fn = Login.methods.get_next_path.bind(_this)
  const actual = fn()

  t.deepEqual(actual, {name: 'example_applet'})
})

test('redirects to root route with multiple components and no previous_route', t => {
  const allowed_read = ['thing', 'example_applet']

  const _this = set({}, '$store.state.meta.user.allowed_apps.read', allowed_read)

  const fn = Login.methods.get_next_path.bind(_this)
  const actual = fn()

  t.is(actual, '/')
})

test('redirects to previous_route with multiple components and previous_route', t => {
  const allowed_read = ['thing', 'example_applet']

  const _this = set({}, '$store.state.meta.user.allowed_apps.read', allowed_read)
  set(_this, '$store.state.meta.previous_route', 'previous')

  const fn = Login.methods.get_next_path.bind(_this)
  const actual = fn()

  t.is(actual, 'previous')
})