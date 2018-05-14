import test from 'ava'
import {shallow} from 'vue-test-utils'
import sinon from 'sinon'

import TemporalFilters from 'apps/irs_monitor/pages/controls/filters/temporal.vue'

const responses = [
  {
    recorded_on: new Date('2017-9-1').toString()
  },
  {
    recorded_on: new Date('2017-9-3').toString()
  },
  {
    recorded_on: new Date('2017-9-5').toString()
  }
]

test('should render', t => {
  shallow(TemporalFilters)

  t.pass()
})


test('should not emit any events when adding the temporal filter without setting start or end', t => {
  const spy = sinon.spy()
  const mock_store = {
    commit: spy
  }

  const wrapper = shallow(TemporalFilters, {
    mocks: {
      $store: mock_store
    },
    propsData: {responses}
  })

  wrapper.vm.add_temporal_filter()

  t.is(spy.notCalled, true)
})

test('should emit 2 valid temporal filters when adding the temporal filter', t => {
  const spy = sinon.spy()
  const mock_store = {
    commit: spy
  }

  const wrapper = shallow(TemporalFilters, {
    mocks: {
      $store: mock_store
    },
    propsData: {responses}
  })

  wrapper.vm.start = new Date('2017-9-1').toString()
  wrapper.vm.end = new Date('2017-9-5').toString()

  wrapper.vm.add_temporal_filter()

  const expected_start = {name: 'recorded_on', comparator: '>=', value: new Date(responses[0].recorded_on).getTime(), display_value: 'Sep 1st 2017'}
  const actual_start = spy.getCall(0).args[1]
  t.deepEqual(expected_start, actual_start)


  const expected_end = {name: 'recorded_on', comparator: '<=', value: new Date(responses[2].recorded_on).getTime(), display_value: 'Sep 5th 2017'}
  const actual_end = spy.getCall(1).args[1]
  t.deepEqual(expected_end, actual_end)
})


