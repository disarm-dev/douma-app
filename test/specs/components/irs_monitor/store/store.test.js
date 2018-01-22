import test from 'ava'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import {cloneDeep} from 'lodash'

import irs_monitor_store from 'apps/irs_monitor/store'


test('can make store', t => {
  const store = new Vuex.Store(cloneDeep(irs_monitor_store))

  t.is(store.state.map_options.selected_layer, 'normalised_risk')
})

test('should change state after commit', t => {
  const responses = [{name: 1}, {name: 2}]
  const store = new Vuex.Store(cloneDeep(irs_monitor_store))

  store.commit('set_responses', responses)

  t.deepEqual(store.state.responses, responses)
  t.is(store.state.responses.length, 2)
})

