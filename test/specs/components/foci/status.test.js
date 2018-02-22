import test from 'ava'
import { shallow } from 'vue-test-utils'
import sinon from 'sinon'
import moment from 'moment'
import status from '../../../../src/apps/foci/pages/status.vue'

const mock_store_empty = {
  state: {
    foci: {
      case_clusters: [],
      case_locations: []
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
        case_locations: []
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
  const date = new Date()
  const mock_store = {
    state: {
      foci: {
        case_clusters: [{ _id: 1 }],
        case_locations: [],
        case_clusters_count: {count: 2, date: date}
      }
    }
  }

  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store
    }
  })

  const actual = wrapper.vm.case_clusters_count
  const expected = { count: 2, date: moment(date).format('MMM Do YYYY, h:mm a')}

  t.deepEqual(actual, expected)
})

test('case_locations_count returns case_locations_count from store', t => {
  const date = new Date()
  const mock_store = {
    state: {
      foci: {
        case_locations_count: {count: 2, date: date}
      }
    }
  }

  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store
    }
  })

  const actual = wrapper.vm.case_locations_count
  const expected = { count: 2, date: moment(date).format('MMM Do YYYY, h:mm a')}

  t.deepEqual(actual, expected)
})


test('case_locations return case_locations from store', t => {
  const mock_store = {
    state: {
      foci: {
        case_clusters: [],
        case_locations: [{ _id: 1 }]
      }
    }
  }

  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store
    }
  })

  const actual = wrapper.vm.case_locations
  const expected = [{ _id: 1 }]

  t.deepEqual(actual, expected)
})

test('renders button for getting case clusters from remote', t => {
  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  const button = wrapper.find('md-button#read_remote_clusters')

  t.true(button.exists())
})

test('clicking get case clusters count button calls read_remote_clusters', t => {
  const spy = sinon.spy()

  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  wrapper.setMethods({
    read_remote_clusters: spy
  })

  const button = wrapper.find('md-button#read_remote_clusters')
  button.trigger('click')

  t.true(spy.called)
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

test('renders button for getting case_locations from remote', t => {
  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  const button = wrapper.find('md-button#read_remote_case_locations')

  t.true(button.exists())
})

test('clicking get case_locations count button calls read_remote_case_locations', t => {
  const spy = sinon.spy()

  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  wrapper.setMethods({
    read_remote_case_locations: spy
  })

  const button = wrapper.find('md-button#read_remote_case_locations')
  button.trigger('click')

  t.true(spy.called)
})

test('renders button for getting case_locations count from remote', t => {
  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  const button = wrapper.find('md-button#read_remote_case_locations_count')

  t.true(button.exists())
})

test('clicking get case_locations count button calls read_remote_case_locations_count', t => {
  const spy = sinon.spy()

  const wrapper = shallow(status, {
    mocks: {
      $store: mock_store_empty
    }
  })

  wrapper.setMethods({
    read_remote_case_locations_count: spy
  })

  const button = wrapper.find('md-button#read_remote_case_locations_count')
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