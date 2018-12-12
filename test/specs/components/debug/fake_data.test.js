import test from 'ava'
import {shallow} from 'vue-test-utils'

import fake_responses_debug from 'apps/debug/pages/fake_data_debug.vue'
import * as exports from 'lib/models/geodata/geodata.valid'
import * as db from 'lib/models/geodata/local.geodata_store'

// What's this?!
db.hydrate_geodata_cache_from_idb = () => Promise.resolve()

test('can mock an import', t => {
  exports.geodata_in_cache_and_valid = () => true
  const actual = exports.geodata_in_cache_and_valid()
  t.true(actual)
})

test.cb.failing('show message if geodata not loaded or valid (mock import)', t => {
  // Ensure geodata is not valid
  exports.geodata_in_cache_and_valid = () => false

  const wrapper = shallow(fake_responses_debug)

  // wrapper.vm.message_type = 'missing_geodata'

  wrapper.vm.$nextTick(() => {
    const actual = wrapper.find('div.applet_container').text()
    t.true(/Missing geodata/.test(actual))
    t.end()
  })
})

test.cb('show message if geodata not loaded or valid (direct set value)', t => {
  const wrapper = shallow(fake_responses_debug)

  wrapper.vm.message_type = 'missing_geodata'

  wrapper.vm.$nextTick(() => {
    const actual = wrapper.find('div.applet_container').text()
    t.true(/Missing geodata/.test(actual))
    t.end()
  })
})

test.cb.failing('sets message_type to `missing_geodata` if geodata not valid', t => {
  exports.geodata_in_cache_and_valid = () => false
  const wrapper = shallow(fake_responses_debug)

  wrapper.vm.$nextTick(() => {
    t.true(wrapper.vm.message_type === 'missing_geodata')
    t.end()
  })
})

test.cb('show input if geodata loaded and valid (mock import)', t => {
  exports.geodata_in_cache_and_valid = () => true
  const wrapper = shallow(fake_responses_debug)

  wrapper.vm.$nextTick(() => {
    const actual = wrapper.find('div.applet_container').text()

    t.true(/Number of areas/.test(actual))
    t.end()
  })

})

test.cb('show input if geodata loaded and valid (direct set value)', t => {
  const wrapper = shallow(fake_responses_debug)

  wrapper.vm.message_type = ''

  wrapper.vm.$nextTick(() => {
    const actual = wrapper.find('div.applet_container').text()

    t.true(/Number of areas/.test(actual))
    t.end()
  })

})