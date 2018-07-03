import test from 'ava'
import {spy, stub} from 'sinon'
import {shallow} from 'vue-test-utils'

import applet from 'apps/irs_record_point/pages/list'
import {ResponseController} from 'lib/models/response/controller'

test.beforeEach(t => {
  ResponseController.prototype.constructor = stub()
  ResponseController.prototype.read_all_cache = stub().resolves([])
  ResponseController.prototype.create_records = stub().resolves()

  t.context.mock_store = {
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

  t.context.wrapper = shallow(applet, {
    mocks: {
      $store: t.context.mock_store,
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
})

test('controller', async (t) => {
  const c = new ResponseController()
  const actual = await c.read_all_cache()
  t.is(actual.length, 0)
})

test('0 responses visible when no responses given in test setup', t => {
  t.context.wrapper.setData({responses: []});

  t.is(t.context.wrapper.vm.responses.length, 0)
  t.is(t.context.wrapper.find('.md-title').text(), '0 responses (0 unsynced)')
})

test('0 responses visible when 0 responses explicitly set', t => {
  t.context.wrapper.setData({responses: []});

  t.is(t.context.wrapper.vm.responses.length, 0)
  t.is(t.context.wrapper.find('.md-title').text(), '0 responses (0 unsynced)')
})

test('1 response visible', t => {
  t.context.wrapper.setData({responses: [{id: 1, synced: false, form_data: {a: 1}}]});

  t.is(t.context.wrapper.vm.filtered_responses.length, 1)
  t.is(t.context.wrapper.vm.responses.length, 1)
  t.is(t.context.wrapper.vm.unsynced_count, 1)
  t.is(t.context.wrapper.find('.md-title').text(), '1 responses (1 unsynced)')
})
