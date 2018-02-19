import test from 'ava'
import { shallow } from 'vue-test-utils'
import sinon from 'sinon'
import filters from '../../../../src/apps/foci/components/filters.vue'

const mock_store = {
  commit: () => {},
  state: {
    foci: {
      filters: []
    }
  }
}

test('renders', t => {
  const wrapper = shallow(filters, {
    mocks: { 
      $store: mock_store
    }
  })

  t.true(wrapper.exists())
})

test('can get correct investigation_status when filters are set', t => {
  const $store = Object.assign(
    {},
    mock_store,
    {
      state: {
        foci: {
          filters: [{name: 'investigation_status', value: 'suggested'}]
        }
      }
    }
  )
  
  const wrapper = shallow(filters, {
    mocks: {
      $store
    }
  })

  t.is(wrapper.vm.investigation_status, 'suggested')
})

test('gets empty investigation_status when filters are not set', t => {
  const wrapper = shallow(filters, {
    mocks: {
      $store: mock_store
    }
  })

  t.is(wrapper.vm.investigation_status, '')
})

test('can get correct status when filters are set', t => {
  const $store = Object.assign(
    {},
    mock_store,
    {
      state: {
        foci: {
          filters: [{ name: 'status', value: 'active' }]
        }
      }
    }
  )

  const wrapper = shallow(filters, {
    mocks: {
      $store
    }
  })

  t.is(wrapper.vm.status, 'active')
})

test('gets emprty status when filters are not set', t => {
  const wrapper = shallow(filters, {
    mocks: {
      $store: mock_store
    }
  })

  t.is(wrapper.vm.status, '')
})

test('sets correct investigation_status', t => {
  const spy = sinon.spy()
  const $store = Object.assign(
    {},
    mock_store,
    {
      commit: spy
    }
  )

  const wrapper = shallow(filters, {
    mocks: {
      $store
    }
  })

  wrapper.vm.investigation_status = 'suggested'

  t.true(spy.called)

  t.is(spy.getCall(0).args[0], 'foci/set_filter')
  t.deepEqual(spy.getCall(0).args[1], {name: 'investigation_status', value: 'suggested'})
})

test('sets correct status', t => {
  const spy = sinon.spy()
  const $store = Object.assign(
    {},
    mock_store,
    {
      commit: spy
    }
  )

  const wrapper = shallow(filters, {
    mocks: {
      $store
    }
  })

  wrapper.vm.status = 'inactive'

  t.true(spy.called)

  t.is(spy.getCall(0).args[0], 'foci/set_filter')
  t.deepEqual(spy.getCall(0).args[1], { name: 'status', value: 'inactive' })
})

test('clear_filters call commit correctly', t => {
  const spy = sinon.spy()
  const $store = Object.assign(
    {},
    mock_store,
    {
      commit: spy
    }
  )

  const wrapper = shallow(filters, {
    mocks: {
      $store
    }
  })

  wrapper.vm.clear_filters()

  t.true(spy.calledTwice)

  t.is(spy.getCall(0).args[0], 'foci/set_filter')
  t.deepEqual(spy.getCall(0).args[1], { name: 'investigation_status', value: '' })

  t.is(spy.getCall(1).args[0], 'foci/set_filter')
  t.deepEqual(spy.getCall(1).args[1], { name: 'status', value: '' })
})
