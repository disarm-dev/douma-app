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
  wrapper.vm.set_start_and_end_dates()
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


test('should set start_date from set_start_date_season', t => {
  const date = new Date('2017-9-3')

  const int_date = +date

  const wrapper = shallow(TemporalFilters, {
    propsData: {
      season_start_date: int_date
    }
  })

  wrapper.vm.set_start_date_season()

  const actual = +new Date(wrapper.vm.start)
  t.is(actual, int_date)
})

test('should show button if season_start_date', t => {
  const wrapper = shallow(TemporalFilters, {
    propsData: {
      season_start_date: (+new Date('2017-9-3'))
    }
  })

  const button = wrapper.find('#season-button')

  t.true(button.exists())
})

test('should hide button if no season_start_date', t => {
  const wrapper = shallow(TemporalFilters, )

  const button = wrapper.find('#season-button')

  t.false(button.exists())
})