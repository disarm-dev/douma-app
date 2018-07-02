import test from 'ava'
import {spy, stub} from 'sinon'
import {shallow} from 'vue-test-utils'

import applet from 'apps/irs_record_point/pages/list'
import * as Controller from 'lib/models/response/controller'


test('0 responses visible when no responses', t => {

  Controller.ResponseController.prototype.constructor = stub()
  Controller.ResponseController.prototype.read_all_cache = stub().returns([])
  Controller.ResponseController.prototype.create_records = stub().returns([])

  const mock_store = {
    state: {
      instance_config: {
        instance: {}
      },
      meta: {},
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

  t.is(wrapper.vm.responses.length, 0)
  t.is(wrapper.find('.md-title').text(), '0 responses (0 unsynced)')
})