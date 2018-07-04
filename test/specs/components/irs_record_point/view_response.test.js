import test from 'ava'
import {shallow} from 'vue-test-utils'
import Response from 'apps/irs_record_point/pages/view_response.vue'


test('Should render response', async t => {
  const wrapper = await shallow(Response, {
    propsData: {response: {any_data: 'really', value: 15}},
  })

  t.is(wrapper.vm.sections.length, 2)
  t.is(wrapper.find('.md-title').text(), 'Submitted response review')
  t.is(wrapper.findAll('h4').at(0).text(), 'any_data')
  t.is(wrapper.findAll('h4').at(1).text(), 'value')
})
