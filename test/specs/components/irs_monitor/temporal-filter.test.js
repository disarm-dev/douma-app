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

test('should render with no responses', t => {
  const wrapper = shallow(TemporalFilters)

  t.notThrows(wrapper.vm.set_start_and_end_dates)
})

test('should render with responses', t => {
  const wrapper = shallow(TemporalFilters, {propsData: {responses}})

  t.notThrows(wrapper.vm.set_start_and_end_dates)
})

test.cb('should set start and end when responses change from no responses to some responses', t => {
  const wrapper = shallow(TemporalFilters)
  wrapper.setProps({responses})

  t.deepEqual(wrapper.vm.responses, responses)
  t.is(wrapper.vm.responses.length, 3)

  wrapper.vm.$nextTick(() => {
    const actual_start = wrapper.vm.start
    t.not(actual_start, null)
    t.true(actual_start instanceof Date)

    const actual_end = wrapper.vm.end
    t.not(actual_end, null)
    t.true(actual_end instanceof Date)

    t.end()
  })

})


test('should set the start date to the earliest date from the responses', t => {
  const wrapper = shallow(TemporalFilters, {
    propsData: {responses}
  })

  const expected = new Date(responses[0].recorded_on).getTime()
  const actual = wrapper.vm.start.getTime()

  t.is(expected, actual)
})

test('should set the end date to the latest date from the responses', t => {
  const wrapper = shallow(TemporalFilters, {
    propsData: {responses}
  })

  const expected = new Date(responses[2].recorded_on).getTime()
  const actual = wrapper.vm.end.getTime()
  t.is(expected, actual)
})

test('should reset start and end dates when calling set_start_and_end_dates()', t => {
  const wrapper = shallow(TemporalFilters, {
    propsData: {responses}
  })

  wrapper.vm.start = new Date('2017-9-2')
  wrapper.vm.end = new Date('2017-9-9')

  wrapper.vm.set_start_and_end_dates()

  const expected_start = new Date(responses[0].recorded_on).getTime()
  const actual_start = wrapper.vm.start.getTime()

  t.is(expected_start, actual_start)

  const expected_end = new Date(responses[2].recorded_on).getTime()
  const actual_end = wrapper.vm.end.getTime()

  t.is(expected_end, actual_end)

})

test('should emit 2 change events when adding the temporal filter', t => {
  const wrapper = shallow(TemporalFilters, {
    propsData: {responses}
  })

  sinon.spy(wrapper.vm, '$emit')

  wrapper.vm.add_temporal_filter()

  t.is(wrapper.vm.$emit.calledTwice, true)
})

test('should emit 2 valid temporal filters when adding the temporal filter', t => {
  const wrapper = shallow(TemporalFilters, {
    propsData: {responses}
  })

  sinon.spy(wrapper.vm, '$emit')

  wrapper.vm.add_temporal_filter()

  const expected_start = {name: 'recorded_on', comparator: '>', value: new Date(responses[0].recorded_on).getTime(), display_value: 'Sep 1st 2017'}
  const actual_start = wrapper.vm.$emit.getCall(0).args[1]
  t.deepEqual(expected_start, actual_start)


  const expected_end = {name: 'recorded_on', comparator: '<', value: new Date(responses[2].recorded_on).getTime(), display_value: 'Sep 5th 2017'}
  const actual_end = wrapper.vm.$emit.getCall(1).args[1]
  t.deepEqual(expected_end, actual_end)
})

test('should not emit a filter when there are no responses', t => {
  const wrapper = shallow(TemporalFilters)

  sinon.spy(wrapper.vm, '$emit')

  wrapper.vm.add_temporal_filter()

  t.is(wrapper.vm.$emit.called, false)
})
