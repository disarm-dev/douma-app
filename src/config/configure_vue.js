import Vue from 'vue'

// Async computed properties - https://alligator.io/vuejs/async-computed-properties/
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

// use vuex
import Vuex from 'vuex'
Vue.use(Vuex)

// use VueRouter
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// vuex-loading
import VueLoading from 'vuex-loading'
Vue.use(VueLoading)

// Components
import {ClientTable} from 'vue-tables-2'
Vue.use(ClientTable)

import TreeView from 'vue-json-tree-view'
Vue.use(TreeView)

// VueMaterial
import VueMaterial from 'vue-material'
Vue.use(VueMaterial)

