import test from 'ava'
import {shallow, mount, createLocalVue} from 'vue-test-utils'
// import sinon from 'sinon'
import foci_detail from '../../../../src/apps/foci/pages/detail.vue'


const mock_store_empty = {
  state: {
    foci: {
      case_clusters: []
    }
  }
}

const mocks = {
  $store: mock_store_empty
}

test('renders', t => {
  const wrapper = shallow(foci_detail, {mocks})
  t.true(wrapper.exists())
})

test('excluded fields is equal to something', t => {
  const wrapper = shallow(foci_detail, {mocks})
  t.deepEqual(wrapper.vm.excluded_fields, ['id', 'geometry'])
})

test('finds case_cluster', t => {
  const mock_store = {
    state: {
      foci: {
        case_clusters: [{id: 1}, {id: 2}]
      }
    }
  }
  const wrapper = shallow(foci_detail, {
    propsData: {foci_id: 1},
    mocks: {$store: mock_store}
  })

  t.deepEqual(wrapper.vm.case_cluster, {id: 1})
})

// TODO: move some logic from the template into the component, v-if and stuff
test('renders inputs for all except excluded fields', t => {

  const mock_store = {
    state: {
      foci: {
        case_clusters: [
          {id: '1', status: "", investigated: "", geometry: ""},
          {id: '2', status: "", investigated: "", geometry: ""}
        ]
      }
    }
  }

  const wrapper = shallow(foci_detail, {
    propsData: {foci_id: '1'},
    mocks: {
      $store: mock_store
    }
  })

  t.deepEqual(wrapper.vm.fields_for_edit, ['status', 'investigated'])
  
})

test('renders an input for each property on a case_cluster', t => {
  const mock_store = {
    state: {
      foci: {
        case_clusters: [
          {id: '1', status: "", investigated: "", geometry: ""},
          {id: '2', status: "", investigated: "", geometry: ""}
        ]
      }
    }
  }

  const wrapper = shallow(foci_detail, {
    propsData: {foci_id: '1'},
    mocks: {
      $store: mock_store
    }
  })
  const inputs = wrapper.findAll('md-input')
  t.is(inputs.length, 2)
})