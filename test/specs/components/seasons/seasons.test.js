import test from 'ava'
import {shallow, createLocalVue} from 'vue-test-utils'
import Vuex from 'vuex'
import sinon from 'sinon'
import Seasons from 'apps/seasons/seasons.vue'

test('should render', t => {
  const mock_store = {
    state: {
      instance_config: {
        applets: {
          irs_monitor: {
            season_start_dates: []
          }
        }
      }
    }
  }

  const wrapper = shallow(Seasons, {
    mocks: {
      $store: mock_store
    }
  })

  t.true(wrapper.exists())
})

test('should render the correct number of items', t => {
  const mock_store = {
    state: {
      instance_config: {
        applets: {
          irs_monitor: {
            season_start_dates: [
              '2017-9-1',
              '2017-10-1',
              '2017-11-1'
            ]
          }
        }
      }
    }
  }

  const wrapper = shallow(Seasons, {
    mocks: {
      $store: mock_store
    }
  })

  const list_items = wrapper.findAll('md-list-item')

  // test the items exist
  t.true(list_items.at(0).exists())
  t.true(list_items.at(1).exists())
  t.true(list_items.at(2).exists())

  // test that there are no more items than we expect.
  t.throws(list_items.at.bind(this,3))
})
