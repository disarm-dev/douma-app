import test from 'ava'
import { shallow } from 'vue-test-utils'
import sinon from 'sinon'
import applet from '../../../../src/apps/foci/pages/applet.vue'



test('renders', t => {
  const mock_store = {
    dispatch: () => {}
  }
  const wrapper = shallow(applet, {
    mocks: {$store: mock_store}
  })

  t.true(wrapper.exists())
})

test('renders router-view', t => {
  const mock_store = {
    dispatch: () => {}
  }
  const wrapper = shallow(applet, {
    mocks: { $store: mock_store }
  })

  const router_view = wrapper.find('router-view')

  t.true(router_view.exists())
})

test('calls get_local on created', t => {
  const stub = sinon.stub()
  const mock_store = {
    dispatch: stub
  }
  const wrapper = shallow(applet, {
    mocks: { $store: mock_store }
  })

  t.true(stub.called)
  t.is(stub.getCall(0).args[0], 'foci/get_case_clusters_local')
})