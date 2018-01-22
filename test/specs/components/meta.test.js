import {shallow} from 'vue-test-utils'
import test from 'ava'
import Home from '../../../src/apps/meta/pages/empty.vue'

test('can mount', t => {
  const wrapper = shallow(Home)
  t.is(false, false)
})