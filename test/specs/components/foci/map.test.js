import test from 'ava'
import {shallow} from 'vue-test-utils'

import map from '../../../../src/apps/foci/pages/map.vue'

const mock_store = {
  state: {
    foci: {
      filters: []
    }
  },
  dispath: () => {
    return Promise.resolve()
  },
  commit: () => {},
}

test('renders', t => {
  const wrapper = shallow(map, {
    mocks: {
      $store: mock_store
    },
    methods: {
      render_map: () => {}
    }
  })

  t.true(wrapper.exists())
})

test('map_id has a corresponding container div', t => {
  const wrapper = shallow(map, {
    mocks: {
      $store: mock_store
    },
    methods: {
      render_map: () => { }
    }
  })

  const map_id = wrapper.vm.map_id

  const container = wrapper.find(`#${map_id}`)
  
  t.true(container.exists())
})