import {shallow} from "vue-test-utils";
import test from "ava";
import Warning from 'apps/seasons/components/warning'



test('should render', t => {
  const wrapper = shallow(Warning)
  let dialog = wrapper.findAll('md-dialog-confirm');
  t.true(wrapper.exists())
  t.true(dialog.at(0).exists())
})

test('Has the right content', t => {
  const wrapper = shallow(Warning);
  let dialog_content = wrapper.findAll('md-dialog-confirm ').at(0)
  t.true(dialog_content.exists())
  t.true(dialog_content.hasAttribute('md-content-html','<b>Editing seasons dates requires reloading the application</b>'))
})


