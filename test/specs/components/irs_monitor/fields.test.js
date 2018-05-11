import test from 'ava'
import {shallow} from 'vue-test-utils'
import sinon from 'sinon'

import Fields from 'apps/irs_monitor/pages/controls/filters/fields'

const responses = [
  {
    field1: {
      field2: 2,
    },
    field3: 3,
    field4: "string 1"
  },
  {
    field1: {
      field2: 3,
    },
    field3: 4,
    field4: "string 2"
  }
]

test('should have no field names when there are no responses', t => {
  const wrapper = shallow(Fields)
  t.deepEqual(wrapper.vm.field_names, [])
})

test('should have no field values when there are no responses', t => {
  const wrapper = shallow(Fields)
  t.deepEqual(wrapper.vm.field_values, [])
})

test('should list all the unique fields from responses', t => {
  const wrapper = shallow(Fields)
  wrapper.setProps({responses})
  t.deepEqual(wrapper.vm.field_names, ['field1.field2', 'field3', 'field4'])
})

test('should list the possible values after selection a field', t => {
  const wrapper = shallow(Fields)
  wrapper.setProps({responses})
  wrapper.setData({filter_name: 'field3'})
  t.deepEqual(wrapper.vm.field_values, [3, 4])

  wrapper.setData({filter_name: 'field4'})
  t.deepEqual(wrapper.vm.field_values, ["string 1", "string 2"])
})

test('should emit change when adding a filter', t => {
  const spy = sinon.spy()
  const mock_store = {
    commit: spy
  }

  const wrapper = shallow(Fields, {
    mocks: {
      $store: mock_store
    },
    propsData: {responses}
  })

  sinon.spy(wrapper.vm, '$emit')

  wrapper.setData({filter_name: 'field4', filter_comparator: 'eq', filter_value: 'string 2'})

  wrapper.vm.add_filter()

  t.true(spy.calledOnce)
  t.is(spy.getCall(0).args[0], 'irs_monitor/add_filter')
})

test('should emit change with a valid filter', t => {
  const spy = sinon.spy()
  const mock_store = {
    commit: spy
  }

  const wrapper = shallow(Fields, {
    mocks: {
      $store: mock_store
    },
    propsData: {responses}
  })

  const expected = {
    name: 'field4',
    comparator: 'eq',
    value: 'string 2'
  }

  sinon.spy(wrapper.vm, '$emit')

  wrapper.setData({filter_name: 'field4', filter_comparator: 'eq', filter_value: 'string 2'})

  wrapper.vm.add_filter()

  t.is(spy.getCall(0).args[0], 'irs_monitor/add_filter')
  t.deepEqual(spy.getCall(0).args[1], expected)
})

