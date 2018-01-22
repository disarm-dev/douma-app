import test from 'ava'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import {cloneDeep} from 'lodash'

import irs_monitor_store from 'apps/irs_monitor/store'


test('should add a filter to the filters array', t => {
  const filter = {name: 'filter_name', comparator: 'eq', value: 'filter_value'}
  const store = new Vuex.Store(cloneDeep(irs_monitor_store))


  t.is(store.state.filters.length, 0)

  store.commit('add_filter', filter)

  t.is(store.state.filters.length, 1)

  t.deepEqual(store.state.filters[0], filter)
})

test('should remove a filter from the filters array', t => {
  const filters = [
    {name: 'filter_name', comparator: 'eq', value: 'filter_value'},
    {name: 'filter_name2', comparator: 'eq', value: 'filter_value2'},
    {name: 'filter_name3', comparator: 'eq', value: 'filter_value3'}
  ]

  const store = new Vuex.Store(cloneDeep(irs_monitor_store))

  t.is(store.state.filters.length, 0)

  filters.forEach(filter => store.commit('add_filter', filter))

  t.is(store.state.filters.length, 3)

  store.commit('remove_filter', filters[0])

  t.is(store.state.filters.length, 2)

  t.is(store.state.filters.indexOf(filters[0]), -1)

})

test('should not add a filter that is already in the filters array', t => {
  const filters = [
    {name: 'filter_name', comparator: 'eq', value: 'filter_value'},
    {name: 'filter_name2', comparator: 'eq', value: 'filter_value2'},
    {name: 'filter_name3', comparator: 'eq', value: 'filter_value3'}
  ]

  const monitor_store_clone = cloneDeep(irs_monitor_store)

  monitor_store_clone.state.filters = filters

  const store = new Vuex.Store(monitor_store_clone)

  // Adding a filter that is already present in the filters array
  store.commit('add_filter', filters[0])

  t.is(store.state.filters.length, 3)
})