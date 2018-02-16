import test from 'ava'
import {shallow, createLocalVue} from 'vue-test-utils'
// import sinon from 'sinon'

import foci_list from '../../../../src/apps/foci/pages/list.vue'

const mock_store_empty = {
  state: {
    foci: {
      case_clusters: {}
    }
  }
}


test('it renders', t => {
  const wrapper = shallow(foci_list, {
    mocks: {
      $store: mock_store_empty
    }
  })
  t.true(wrapper.exists())
})

test('table_columns should be an array of string when data is there', t => {
  const wrapper = shallow(foci_list, {
    mocks: {
      $store: {
        state: {
          foci: {
            case_clusters: [
              {
                test_1: 1,
                test_2: 1
              }
            ]
          }
        }
      }
    }
  })

  t.deepEqual(wrapper.vm.table_columns, ['_id', 'investigation_status', 'status',  'updated_at'])
})


test('table_data should be an empty array when no case_clusters', t => {
  const wrapper = shallow(foci_list, {
    mocks: {
      $store: mock_store_empty
    }
  })

  t.deepEqual(wrapper.vm.table_data, [])
})

test('table_data should be an array of objects when data is there', t => {
  const wrapper = shallow(foci_list, {
    mocks: {
      $store: {
        state: {
          foci: {
            case_clusters: [
              {
                test_1: 1,
                test_2: 1
              }
            ]
          }
        }
      }
    }
  })
  t.deepEqual(wrapper.vm.table_data, [{test_1: 1, test_2: 1}])
})