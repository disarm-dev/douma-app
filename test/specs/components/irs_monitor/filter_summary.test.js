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

  t.true(wrapper.hasProp('filters', filters))
})

test('should emit remove_filter event when removing a filter', t => {
  const wrapper = shallow(Summary, {
    propsData: {filters}
  })

  sinon.spy(wrapper.vm, '$emit')

  wrapper.vm.on_delete(filters[0])

  t.true(wrapper.vm.$emit.calledOnce)

  t.deepEqual(wrapper.vm.$emit.getCall(0).args[0], 'remove_filter')
  t.deepEqual(wrapper.vm.$emit.getCall(0).args[1], filters[0])
})