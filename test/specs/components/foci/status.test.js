import test from 'ava'
import { shallow } from 'vue-test-utils'
import sinon from 'sinon'
import status from '../../../../src/apps/foci/pages/status.vue'

const mock_store_empty = {
  state: {
    foci: {
      case_clusters: [],
      cases: []
    }
  }
}

test('renders', t => {
  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  t.true(wrapper.exists())
})

test('case_clusters returns case_clusters from store', t => {
  const mock_store = {
    state: {
      foci: {
        case_clusters: [{_id: 1}],
        cases: []
      }
    }
  }

  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store
    }
  })

  const actual = wrapper.vm.case_clusters
  const expected = [{_id: 1}]

  t.deepEqual(actual, expected)
})

test('cases return cases from store', t => {
  const mock_store = {
    state: {
      foci: {
        case_clusters: [],
        cases: [{ _id: 1 }]
      }
    }
  }

  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store
    }
  })

  const actual = wrapper.vm.cases
  const expected = [{ _id: 1 }]

  t.deepEqual(actual, expected)
})

test('renders button for rerunning model', t => {
  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  const button = wrapper.find('md-button')

  t.true(button.exists())
})

test('clicking button calls rerun_model', t => {
  const spy = sinon.spy()
  
  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  wrapper.setMethods({
    rerun_model: spy
  })

  const button = wrapper.find('md-button')
  button.trigger('click')

  t.true(spy.called)
})