import test from 'ava'
import {shallow} from 'vue-test-utils'
import sinon from 'sinon'
import Seasons from 'apps/seasons/seasons.vue'

// UI
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
  t.throws(list_items.at.bind(this, 3))
})

test('renders a remove button for each list item', t => {
  const mock_store = {
    state: {
      instance_config: {
        applets: {
          irs_monitor: {
            season_start_dates: ['2018-01-01', '2018-02-01', '2018-03-01']
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

  const buttons = wrapper.findAll('md-list-item md-button')

  t.true(buttons.at(0).exists())
  t.true(buttons.at(1).exists())
  t.true(buttons.at(2).exists())

  // test that there are no more items than we expect.
  t.throws(buttons.at.bind(this, 3))

})

test('shows an error if error', t => {
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
  t.throws(() => wrapper.findAll('.errors span').at(0).exists())
  wrapper.setData({error: 'There is an error'})
  t.true(wrapper.findAll('.errors span').exists())
})


test('renders an add button', t => {
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
  let button = wrapper.findAll('#add_new_season');
  t.true(button.at(0).exists())
})

// UI Interactions
test('clicking add new season should call add_season', t => {
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

  const spy = sinon.spy()

  const wrapper = shallow(Seasons, {
    mocks: {
      $store: mock_store
    },
    methods: {
      add_season: spy
    }
  })

  const button = wrapper.find('#add_new_season')

  button.trigger('click')

  t.true(spy.calledOnce)
})

// const buttons = wrapper.findAll('md-list-item md-button')
// buttons.at(0).trigger('click')

test('clicking remove season should call remove_season', t => {
  const remove_season = sinon.spy();

  const mock_store = {
    state: {
      instance_config: {
        applets: {
          irs_monitor: {
            season_start_dates: ['2018-01-01']
          }
        }
      }
    }
  }


  const wrapper = shallow(Seasons, {
    mocks: {
      $store: mock_store
    },
    methods: {
      remove_season
    }
  })

  const buttons = wrapper.findAll('md-list-item md-button')
  buttons.at(0).trigger('click')
  t.true(remove_season.calledOnce)
})


// Method test

test.todo('validate_seasons returns true for a valid season_start_dates')

test.todo('validate_seasons returns false for an invalid season_start_dates')

test.todo('validate_seasons sets error for an invalid season_start_dates')

// const stub = sinon.stub().returns(false)

// wrapper.setMethods({
//   validate_seasons: stub
// })

// t.true(stub.called)

test.todo('push_date should push a season_start_date and reset new_season_start_date and call save_config')

test.todo('push_date should not call save_config and not modify season_start_dates')

// Test remove_season
