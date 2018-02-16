import test from 'ava'
import {shallow, mount} from 'vue-test-utils'
import sinon from 'sinon'

import foci_front_page from '../../../../src/apps/foci/pages/front_page.vue'

test('it renders', t => {
  const wrapper = shallow(foci_front_page)

  t.true(wrapper.exists())
})

test('it renders three links', t => {
  const wrapper = mount(foci_front_page)

  const elements = wrapper.findAll('router-link')

  t.is(elements.length, 3)
})