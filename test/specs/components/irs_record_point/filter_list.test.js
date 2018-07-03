import test from 'ava'
import {spy, stub} from 'sinon'
import {shallow} from 'vue-test-utils'

import applet from 'apps/irs_record_point/pages/list'
import * as Controller from 'lib/models/response/controller'


test.beforeEach(() => {
  Controller.ResponseController.prototype.constructor = stub()
  Controller.ResponseController.prototype.read_all_cache = stub().resolves([])
  Controller.ResponseController.prototype.create_records = stub().resolves()
})

function basic_objects() {
  const mock_store = {
    state: {
      instance_config: {
        instance: {}
      },
      meta: {},
      applets: {
        irs_record_point: {
          filter_field: 'a'
        }
      }
    },
    commit: () => {
    },
    dispatch: () => {
    }
  }
  const wrapper = shallow(applet, {
    mocks: {
      $store: mock_store,
      $router: {
        goBack: () => {
        }
      },
      $route: {name: ''},
      $can: () => true,
      $loading: {
        startLoading: () => {
        },
        anyLoading: () => false,
        isLoading: () => false,
        endLoading: () => {
        },
      },
    },
  })

  return {
    mock_store,
    wrapper
  }
}

test('controller', async (t) => {
  const c = new Controller.ResponseController()
  const actual = await c.read_all_cache()
  t.is(actual.length, 0)
})

test('0 responses visible when no responses given in test setup', t => {
  const {mock_store, wrapper} = basic_objects()
  wrapper.setData({responses: []});

  t.is(wrapper.vm.responses.length, 0)
  t.is(wrapper.find('.md-title').text(), '0 responses (0 unsynced)')
})

test('0 responses visible when 0 responses explicitly set', t => {
  const {mock_store, wrapper} = basic_objects()
  wrapper.setData({responses: []});

  t.is(wrapper.vm.responses.length, 0)
  t.is(wrapper.find('.md-title').text(), '0 responses (0 unsynced)')
})

test('1 response visible', t => {
  const {mock_store, wrapper} = basic_objects()
  wrapper.setData({responses: [{id: 1, synced: false, form_data: {a: 1}}]});

  t.is(wrapper.vm.filtered_responses.length, 1)
  t.is(wrapper.vm.responses.length, 1)
  t.is(wrapper.vm.unsynced_count, 1)
  t.is(wrapper.find('.md-title').text(), '1 responses (1 unsynced)')
})
