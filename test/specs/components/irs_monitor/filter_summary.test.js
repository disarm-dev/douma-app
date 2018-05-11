import test from 'ava'
import {shallow, mount} from 'vue-test-utils'
import sinon from 'sinon'
import Summary from 'apps/irs_monitor/pages/controls/filters/summary.vue'


const filters = [
  {name: 'filter_name', comparator: 'eq', value: 'filter_value'},
  {name: 'filter_name2', comparator: 'eq', value: 'filter_value2'}
]

test('should accept filters as a prop', t => {
  const wrapper = mount(Summary, {
    propsData: {filters}
  })

  t.deepEqual(wrapper.props().filters, filters)
})

test('should emit remove_filter event when removing a filter', t => {
  const spy = sinon.spy()
  const mock_store = {
    commit: spy
  }

  const wrapper = shallow(Summary, {
    mocks: {$store: mock_store},
    propsData: {filters}
  })

  sinon.spy(wrapper.vm, '$emit')

  wrapper.vm.on_delete(filters[0])

  t.true(spy.calledOnce)

  t.deepEqual(spy.getCall(0).args[0], 'irs_monitor/remove_filter')
  t.deepEqual(spy.getCall(0).args[1], filters[0])
})