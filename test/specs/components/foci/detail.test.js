import test from 'ava'
import {shallow, createLocalVue} from 'vue-test-utils'
// import sinon from 'sinon'

import foci_detail from '../../../../src/apps/foci/pages/detail.vue'

test.todo('renders', t => {
  const wrapper = shallow(foci_detail)
})

test.todo('excluded fields is equal to something', t => {
  const wrapper = shallow(foci_detail)
})

test.todo('finds case_cluster', t => {
  const wrapper = shallow(foci_detail)
})

// TODO: move some logic from the template into the component, v-if and stuff
test.todo('renders inputs for all except excluded fields', t => {
  const wrapper = shallow(foci_detail)
})