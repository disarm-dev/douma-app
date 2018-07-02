import test from 'ava'
import {spy, stub} from 'sinon'
import {shallow} from 'vue-test-utils'

import applet from 'apps/irs_record_point/pages/list'
import * as Controller from 'lib/models/response/controller'


test.beforeEach(() => {
  Controller.ResponseController.prototype.constructor = stub()
  Controller.ResponseController.prototype.read_all_cache = stub().resolves([{recorded_on: new Date()}, {recorded_on: new Date()}])
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

test.skip('0 responses visible when no responses', t => {
  const {mock_store, wrapper} = basic_objects()

  t.is(wrapper.vm.responses.length, 0)
  t.is(wrapper.find('.md-title').text(), '0 responses (0 unsynced)')
})

test('1 response visible', t => {
  const {mock_store, wrapper} = basic_objects()
  wrapper.vm.responses = [{id: 1, synced: false, form_data: {a: 1}}]

  t.is(wrapper.vm.filtered_responses.length, 1)
  t.is(wrapper.vm.responses.length, 1)
  t.is(wrapper.vm.unsynced_count, 1)
  t.is(wrapper.find('.md-title').text(), '1 responses (1 unsynced)')
})
