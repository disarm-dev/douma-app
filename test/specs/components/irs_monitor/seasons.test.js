import test from 'ava'
import { shallow, mount } from 'vue-test-utils'
import sinon from 'sinon'
import moment from 'moment'
import Seasons from 'apps/irs_monitor/pages/controls/seasons.vue'


test('it renders', async t => {
  const mock_store = {
    commit() { },
    state: { irs_monitor: { dashboard_options: { season_start_date: '' } } }
  }
  const wrapper = shallow(Seasons, {
    mocks: { $store: mock_store }
  })
  t.true(wrapper.exists())
})

test('is renders an option for each start date', async t => {
  const mock_store = {
    commit() { },
    state: { irs_monitor: { dashboard_options: { season_start_date: '' } } }
  }
  const wrapper = shallow(Seasons, {
    propsData: {
      season_start_dates: ['2018-01-01', '2018-02-01']
    },
    mocks: {
      $store: mock_store
    }
  })

  const options = wrapper.findAll('md-option')

  t.true(options.at(0).exists())
  t.true(options.at(1).exists())
})


test('setting season_start_date commits to the store', async t => {
  const spy = sinon.spy()
  const mock_store = {
    commit: spy,
    state: { irs_monitor: { dashboard_options: { season_start_date: '' } } }
  }
  const wrapper = shallow(Seasons, {
    mocks: { $store: mock_store }
  })
  
  wrapper.vm.selected_start_date = '2018-01-01'

  t.true(spy.called)
  t.is(spy.getCall(0).args[0], 'irs_monitor/set_dashboard_option')
  t.deepEqual(spy.getCall(0).args[1], { key: 'season_start_date', value: '2018-01-01'})
})

test('clicking an option calls add_temporal_filter', async t => {
  const mock_store = {
    commit() { },
    state: { irs_monitor: { dashboard_options: { season_start_date: '' } } }
  }
  const spy = sinon.spy()
  const wrapper = shallow(Seasons, {
    propsData: {
      season_start_dates: ['2018-01-01', '2018-02-01']
    },
    methods: {
      set_season: spy
    },
    mocks: {
      $store: mock_store
    }
  })

  const options = wrapper.findAll('md-option')
  options.at(0).trigger('selected')

  t.true(spy.calledOnce)
  t.is(spy.getCall(0).args[0], '2018-01-01')
  t.is(spy.getCall(0).args[1], 0)
})

test('calling set_season with the last date sets start_date to start_date and end_date to now', async t => {
  const spy = sinon.spy()
  const mock_store = {
    commit: spy,
    state: {
      irs_monitor:{
        filters:[],
        dashboard_options: { season_start_date: '' }
      }
    }
  }

  const wrapper = shallow(Seasons, {
    propsData: {
      season_start_dates: ['2018-01-01', '2018-02-01']
    },
    mocks: {
      $store: mock_store
    }
  })
  const date_to_test_against = +new Date()
  wrapper.vm.set_season('2018-02-01', 1)

  t.is(spy.getCall(1).args[0], 'irs_monitor/add_filter')
  t.is(spy.getCall(1).args[1].name, 'recorded_on')
  t.is(spy.getCall(1).args[1].comparator, '>=')
  t.is(spy.getCall(1).args[1].value, new Date('2018-02-01').getTime())


  t.is(spy.getCall(2).args[0], 'irs_monitor/add_filter')
  t.is(spy.getCall(2).args[1].name, 'recorded_on')
  t.is(spy.getCall(2).args[1].comparator, '<=')

  // This is really hard to test, if we just used equal it would fail on a slow machine
  t.true(spy.getCall(2).args[1].value <= date_to_test_against)
})


test('calling set_season with the first date sets start_date to start_date and end_date to the next start_date', async t => {
  const spy = sinon.spy()
  const mock_store = {
    commit: spy,
    state: {
      irs_monitor:{
        filters:[],
        dashboard_options: { season_start_date: '' }
      }
    }
  }

  const wrapper = shallow(Seasons, {
    propsData: {
      season_start_dates: [ '2018-02-01','2018-01-01']
    },
    mocks: {
      $store: mock_store
    }
  })
  wrapper.vm.set_season('2018-01-01', 1)


  t.is(spy.getCall(1).args[0], 'irs_monitor/add_filter')
  t.is(spy.getCall(1).args[1].name, 'recorded_on')
  t.is(spy.getCall(1).args[1].comparator, '>=')
  t.is(spy.getCall(1).args[1].value, new Date('2018-01-01').getTime())



  t.is(spy.getCall(2).args[0], 'irs_monitor/add_filter')
  t.is(spy.getCall(2).args[1].name, 'recorded_on')
  t.is(spy.getCall(2).args[1].comparator, '<=')
  t.deepEqual(moment(spy.getCall(2).args[1].value).toDate(), moment('2018-01-31').toDate())

})
