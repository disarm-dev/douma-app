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

test('case_clusters_count returns case_clusters_count from store', t => {
  const mock_store = {
    state: {
      foci: {
        case_clusters: [{ _id: 1 }],
        cases: [],
        case_clusters_count: 2
      }
    }
  }

  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store
    }
  })

  const actual = wrapper.vm.case_clusters_count
  const expected = 2

  t.deepEqual(actual, expected)
})

test('cases_count returns cases_count from store', t => {
  const mock_store = {
    state: {
      foci: {
        cases_count: 2
      }
    }
  }

  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store
    }
  })

  const actual = wrapper.vm.cases_count
  const expected = 2

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

test('renders button for getting case clusters count from remote', t => {
  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  const button = wrapper.find('md-button#read_remote_clusters_count')

  t.true(button.exists())
})

test('clicking get case clusters count button calls read_remote_clusters_count', t => {
  const spy = sinon.spy()

  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  wrapper.setMethods({
    read_remote_case_clusters_count: spy
  })

  const button = wrapper.find('md-button#read_remote_clusters_count')
  button.trigger('click')

  t.true(spy.called)
})


test('renders button for getting cases count from remote', t => {
  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  const button = wrapper.find('md-button#read_remote_cases_count')

  t.true(button.exists())
})

test('clicking get cases count button calls read_remote_cases_count', t => {
  const spy = sinon.spy()

  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  wrapper.setMethods({
    read_remote_cases_count: spy
  })

  const button = wrapper.find('md-button#read_remote_cases_count')
  button.trigger('click')

  t.true(spy.called)
})

test('renders button for rerunning model', t => {
  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  const button = wrapper.find('md-button#rerun_model')

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

  const button = wrapper.find('md-button#rerun_model')
  button.trigger('click')

  t.true(spy.called)
})