import test from 'ava'
import { shallow } from 'vue-test-utils'
import sinon from 'sinon'
import applet from '../../../../src/apps/foci/components/filters.vue'

const mock_store = {
  commit: () => {},
  state: {
    foci: {
      filters: []
    }
  }
}

test('renders', t => {
  const wrapper = shallow(applet, {
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
  
  const wrapper = shallow(applet, {
    mocks: {
      $store
    }
  })

  t.is(wrapper.vm.investigation_status, 'suggested')
})

test('gets empty investigation_status when filters are not set', t => {
  const wrapper = shallow(applet, {
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

  const wrapper = shallow(applet, {
    mocks: {
      $store
    }
  })

  t.is(wrapper.vm.status, 'active')
})

test('gets emprty status when filters are not set', t => {
  const wrapper = shallow(applet, {
    mocks: {
      $store: mock_store
    }
  })

  t.is(wrapper.vm.status, '')
})

test.todo('sets correct investigation_status')

test.todo('sets correct status')

test.todo('clear_filters call commit correctly')
