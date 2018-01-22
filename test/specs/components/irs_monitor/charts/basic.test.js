import test from 'ava'
import {shallow} from 'vue-test-utils'

import Chart from 'apps/irs_monitor/pages/charts/chart.vue'

test('can create component', t => {
  const wrapper = shallow(Chart)
  t.true(wrapper.exists())
})

test('chart data starts with an empty array', t => {
  const wrapper = shallow(Chart)
  const chart_data = wrapper.vm.data

  t.is(chart_data.length, 0)
  t.true(Array.isArray(chart_data))
})

test('render_chart needs responses', t => {
  const wrapper = shallow(Chart)
  const actual = wrapper.vm.render_chart()

  t.false(actual)
})

