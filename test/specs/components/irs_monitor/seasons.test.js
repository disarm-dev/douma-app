import test from 'ava'
import { shallow, mount } from 'vue-test-utils'
import sinon from 'sinon'
import Seasons from 'apps/irs_monitor/pages/controls/seasons.vue'

test('it renders', async t => {
  const wrapper = shallow(Seasons)
  t.true(wrapper.exists())
})

test('is renders an option for each start date', async t => {
  const wrapper = shallow(Seasons, {
    propsData: {
      season_start_dates: ['2018-01-01', '2018-02-01']
    }
  })

  const options = wrapper.findAll('md-option')

  t.true(options.at(0).exists())
  t.true(options.at(1).exists())
})

test('clicking an option calls add_temporal_filter', async t => {
  const spy = sinon.spy()
  const wrapper = shallow(Seasons, {
    propsData: {
      season_start_dates: ['2018-01-01', '2018-02-01']
    },
    methods: {
      add_temporal_filter: spy
    }
  })

  const options = wrapper.findAll('md-option')
  options.at(0).trigger('selected')

  t.true(spy.calledOnce)
  t.is(spy.getCall(0).args[0], '2018-01-01')
  t.is(spy.getCall(0).args[1], 0)
})

test('calling add_temporal_filter with the last date sets start_date to start_date and end_date to now', async t => {
  const spy = sinon.spy()
  const mock_store = {
    commit: spy
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
  wrapper.vm.add_temporal_filter('2018-02-01', 1)

  t.true(spy.calledTwice)
  t.is(spy.getCall(0).args[0], 'irs_monitor/add_filter')
  t.is(spy.getCall(0).args[1].name, 'recorded_on')
  t.is(spy.getCall(0).args[1].comparator, '>')
  t.is(spy.getCall(0).args[1].value, new Date('2018-02-01').getTime())

  
  t.is(spy.getCall(1).args[0], 'irs_monitor/add_filter')
  t.is(spy.getCall(1).args[1].name, 'recorded_on')
  t.is(spy.getCall(1).args[1].comparator, '<')
  
  // This is really hard to test, if we just used equal it would fail on a slow machine
  t.true(spy.getCall(1).args[1].value >= date_to_test_against)
})


test('calling add_temporal_filter with the first date sets start_date to start_date and end_date to the next start_date', async t => {
  const spy = sinon.spy()
  const mock_store = {
    commit: spy
  }

  const wrapper = shallow(Seasons, {
    propsData: {
      season_start_dates: ['2018-01-01', '2018-02-01']
    },
    mocks: {
      $store: mock_store
    }
  })
  wrapper.vm.add_temporal_filter('2018-01-01', 0)


  t.true(spy.calledTwice)
  t.is(spy.getCall(0).args[0], 'irs_monitor/add_filter')
  t.is(spy.getCall(0).args[1].name, 'recorded_on')
  t.is(spy.getCall(0).args[1].comparator, '>')
  t.is(spy.getCall(0).args[1].value, new Date('2018-01-01').getTime())



  t.is(spy.getCall(1).args[0], 'irs_monitor/add_filter')
  t.is(spy.getCall(1).args[1].name, 'recorded_on')
  t.is(spy.getCall(1).args[1].comparator, '<')
  t.is(spy.getCall(1).args[1].value, new Date('2018-02-01').getTime())

})