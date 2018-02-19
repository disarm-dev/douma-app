import test from 'ava'
import {shallow, mount, createLocalVue} from 'vue-test-utils'
import sinon from 'sinon'
import foci_detail from '../../../../src/apps/foci/pages/detail.vue'


const mock_store_empty = {
  dispatch: () => Promise.resolve(),
  commit: () => {},
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
  const wrapper = shallow(foci_detail, {
    mocks, 
    methods: {render_map: () => { }}
  })
  t.true(wrapper.exists())
})

test('excluded fields is equal to something', t => {
  const wrapper = shallow(foci_detail, { mocks, methods: { render_map: () => { } }})
  t.deepEqual(wrapper.vm.excluded_fields, ['_id', 'geometry'])
})

test('finds case_cluster', t => {
  const mock_store = {
    dispatch: () => Promise.resolve(),
    commit: () => {},
    state: {
      foci: {
        case_clusters: [{_id: 1}, {_id: 2}]
      }
    }
  }
  const wrapper = shallow(foci_detail, {
    propsData: {foci_id: 1},
    mocks: {$store: mock_store},
    methods: { render_map: () => { } }
  })

  t.deepEqual(wrapper.vm.case_cluster, {_id: 1})
})

test('save_changes calls dispatch', t => {
  const spy = sinon.stub().resolves()
  const mock_store = {
    dispatch: spy,
    commit: () => {},
    state: {
      foci: {
        case_clusters: [{ _id: 1 }, { _id: 2 }]
      }
    }
  }
  const wrapper = shallow(foci_detail, {
    propsData: { foci_id: 1 },
    mocks: { $store: mock_store },
    methods: { render_map: () => { } }
  })

  wrapper.vm.save_changes()

  t.true(spy.called)
  t.is(spy.getCall(0).args[0], 'foci/update_case_cluster')
  t.deepEqual(spy.getCall(0).args[1], { _id: 1 })
})

test('renders attributes if there is a cluster', t => {
  const mock_store = {
    dispatch: () => Promise.resolve(),
    commit: () => {},
    state: {
      foci: {
        case_clusters: [{ _id: 1 }, { _id: 2 }]
      }
    }
  }
  const wrapper = shallow(foci_detail, {
    propsData: { foci_id: 1 },
    mocks: { $store: mock_store },
    methods: { render_map: () => { } }
  })

  t.deepEqual(wrapper.vm.case_cluster, {_id: 1})
  const attributes = wrapper.find("#attributes")
  t.true(attributes.exists())

})

test('does not render attributes unless there a cluster', t => {
  const wrapper = shallow(foci_detail, {
    propsData: { foci_id: 1 },
    mocks: { $store: mock_store_empty },
    methods: { render_map: () => { } }
  })

  t.is(wrapper.vm.case_cluster, undefined)
  const attributes = wrapper.find("#attributes")
  t.false(attributes.exists())
})

test('renders an input for each property on a case_cluster', t => {
  const mock_store = {
    dispatch: () => Promise.resolve(),
    commit: () => {},
    state: {
      foci: {
        case_clusters: [
          {_id: '1', status: "", investigated: "", geometry: ""},
          {_id: '2', status: "", investigated: "", geometry: ""}
        ]
      }
    }
  }

  const wrapper = shallow(foci_detail, {
    propsData: {foci_id: '1'},
    mocks: {
      $store: mock_store
    },
    methods: { render_map: () => { } }
  })
  const inputs = wrapper.findAll('md-select')
  t.is(inputs.length, 2)
})

test('create_fields_for_edit creates array of objects', t => {
  const wrapper = shallow(foci_detail, {
    mocks: {
      $store: mock_store_empty
    },
    methods: { render_map: () => { } }
  })

  const actual = wrapper.vm.fields
  const expected = [{ "type": "text", "enum": ["investigated", "suggested", "visual review"], "name": "investigation_status" }, { "type": "text", "enum": ["active", "inactive", "cleared"], "name": "status" }]
  t.deepEqual(actual, expected)
})