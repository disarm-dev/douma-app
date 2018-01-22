import test from 'ava'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import {cloneDeep} from 'lodash'

import irs_monitor_store from 'apps/irs_monitor/store'


const responses = [
  {id: 1, question: 2, location: {selection: {id: 3}}},
  {id: 2, question: 2, location: {selection: {id: 3}}},
  {id: 3, question: 3, location: {selection: {id: 3}}}
]

test('should return all responses with no filters', t => {
  const store_content = cloneDeep(irs_monitor_store)
  store_content.state.responses = responses
  store_content.state.dashboard_options.limit_to_plan = false

  const store = new Vuex.Store(store_content)

  t.is(store.getters.filtered_responses.length, 3)
})


test('should filter responses when filters are present returning 1 response', t => {
  const filter = {name: 'id', comparator: '==', value: 2}
  const store_content = cloneDeep(irs_monitor_store)

  store_content.state.responses = responses
  store_content.state.filters = [filter]
  store_content.state.dashboard_options.limit_to_plan = false

  const store = new Vuex.Store(store_content)
  t.is(store.getters.filtered_responses.length, 1)
})

test('should filter responses when filters are present returning more than 1 response', t => {
  const filter = {name: 'question', comparator: '==', value: 2}
  const store_content = cloneDeep(irs_monitor_store)

  store_content.state.responses = responses
  store_content.state.filters = [filter]
  store_content.state.dashboard_options.limit_to_plan = false

  const store = new Vuex.Store(store_content)
  t.is(store.getters.filtered_responses.length, 2)
})

test('should filter responses according to plan', t => {
  const plan = {
    targets: [{id: 1},{id: 2},{id: 3}]
  }

  const local_responses = [
    {location: {selection: {id: 1}}},
    {location: {selection: {id: 2}}},
    {location: {selection: {id: 3}}},
    {location: {selection: {id: 4}}}
  ]

  const store_content = cloneDeep(irs_monitor_store)
  store_content.state.plan = plan
  store_content.state.responses = local_responses
  store_content.state.dashboard_options.limit_to_plan = true

  const store = new Vuex.Store(store_content)

  t.is(store.getters.filtered_responses.length, 3)
})