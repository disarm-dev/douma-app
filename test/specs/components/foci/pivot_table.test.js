import test from 'ava'
import { shallow } from 'vue-test-utils'
import sinon from 'sinon'
import pivot_table from '../../../../src/apps/foci/components/pivot_table.vue'

const propsData = {
  data: [],
  x_axis_property: 'status',
  x_axis_enums: ['active', 'inactive', 'cleared'],
  y_axis_property: 'investigation_status',
  y_axis_enums: ['investigated', 'suggested', 'visual review']
}

test('renders', t => {
  const wrapper = shallow(pivot_table, {
    propsData
  })

  t.true(wrapper.exists())
})

test('renders a row for each y_axis_enum + header', t => {
  const wrapper = shallow(pivot_table, {
    propsData
  })

  const table_rows = wrapper.findAll('md-table-row')

  // the +1 is for the header row
  t.is(table_rows.length, wrapper.vm.y_axis_enums.length + 1)
})

test('renders a table-head for each x_axis_enum + header', t => {
  const wrapper = shallow(pivot_table, {
    propsData
  })

  const table_heads = wrapper.findAll('md-table-head')

  // the +1 is for the header row
  t.is(table_heads.length, wrapper.vm.x_axis_enums.length + 1)
})

test('renders a table full of zeros when there is no data', t => {
  const wrapper = shallow(pivot_table, {
    propsData
  })

  const cells = wrapper.findAll('md-table-cell.data-field')

  t.is(cells.length, 9)

  for (const index of [...Array(cells.length).keys()]) {
    const cell = cells.at(index)
    t.is(cell.text(), '0')
  }
})



test.skip('clicking a cell calls handle_click', async t => {
  const spy = sinon.spy()
  const wrapper = shallow(pivot_table, {
    propsData
  })

  wrapper.setMethods({handle_click: spy})

  const cell = wrapper.find('md-table-cell.data-field')

  t.true(cell.exists())
  
  cell.trigger('click')

  t.true(spy.called)
})