import test from 'ava'
import { shallow } from 'vue-test-utils'
import sinon from 'sinon'
import applet from '../../../../src/apps/foci/pages/applet.vue'



test('renders', t => {
  const mock_store = {
    dispatch: () => {}
  }
  const wrapper = shallow(applet, {
    mocks: {$store: mock_store, $router: {goBack: () => {}}, $route: {name: ''} }
  })

  t.true(wrapper.exists())
})

test('renders router-view', t => {
  const mock_store = {
    dispatch: () => {}
  }
  const wrapper = shallow(applet, {
    mocks: { $store: mock_store, $router: {goBack: () => {}}, $route: {name: ''} }
  })

  const router_view = wrapper.find('router-view')

  t.true(router_view.exists())
})

test('calls get_local on created with correct args', t => {
  const stub = sinon.stub()
  const mock_store = {
    dispatch: stub
  }
  const wrapper = shallow(applet, {
    mocks: { $store: mock_store, $router: {goBack: () => {}}, $route: {name: ''} }
  })

  t.true(stub.called)
  t.is(stub.getCall(0).args[0], 'foci/get_case_clusters_local')
  t.is(stub.getCall(1).args[0], 'foci/get_case_locations_local')
})