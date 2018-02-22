import {CaseClustersController} from "./lib/models/case_clusters/controller"
import {CaseLocationsController} from "./lib/models/case_locations/controller"

const case_clusters_controller = new CaseClustersController('foci')
const case_locations_controller = new CaseLocationsController('foci')

export default {
  namespaced: true,
  unpersisted_state_keys: ['case_locations', 'case_clusters'],
  state: {
    case_locations: null,
    case_clusters: null,
    case_clusters_count: null,
    case_locations_count: null,
    filters: []
  },
  mutations: {
    // case clusters
    set_case_clusters(state, case_clusters) {
      state.case_clusters = case_clusters
    },
    set_case_cluster(state, incoming_case_cluster) {
      const index = state.case_clusters.findIndex(cluster => cluster._id === incoming_case_cluster._id)
      state.case_clusters.splice(index, 1, incoming_case_cluster)
    },
    set_case_clusters_count(state, count) {
      state.case_clusters_count = {count, date: new Date()}
    },

    // case locations
    set_case_locations(state, case_locations) {
      state.case_locations = case_locations
    },
    set_case_locations_count(state, count) {
      state.case_locations_count = { count, date: new Date() }
    },

    // filters
    set_filter(state, filter) {
      if (state.filters.find(f => f.name === filter.name)) {
        const index = state.filters.findIndex(f => f.name === filter.name)
        state.filters.splice(index, 1, filter)
      } else {
        state.filters.push(filter)
      }
    }
  },
  getters: {
    filtered_case_clusters(state) {
      if (!state.case_clusters) return []

      return state.case_clusters.filter(case_cluster => {
        return state.filters.every(filter => {
          // if the filters value is "", then we don't use that filter
          if (!filter.value.length) return true

          return case_cluster[filter.name] === filter.value
        })
      })
    }
  },
  actions: {
    // Case clusters
    async get_case_clusters(context) {
      const case_clusters = await case_clusters_controller.read_all_network()
      context.commit('set_case_clusters', case_clusters)
      context.commit('set_case_clusters_count', case_clusters.length)
    },
    async get_case_clusters_count(context) {
      const count = await case_clusters_controller.read_count()
      context.commit('set_case_clusters_count', count)
    },
    async update_case_cluster(context, case_cluster) {
      const updated_case_cluster = await case_clusters_controller.update_case_cluster(case_cluster)
      context.commit('set_case_cluster', case_cluster)
    },
    async get_case_clusters_local(context) {
      const case_clusters = await case_clusters_controller.read_local()
      context.commit('set_case_clusters', case_clusters)
    },
    async run_model(context) {
      await case_clusters_controller.run_model()
      context.commit('root:set_snackbar', {message: "Running remote model"}, {root: true})
    },
    
    // Case locations
    async get_case_locations(context) {
      const case_locations = await case_locations_controller.read_all_network()
      context.commit('set_case_locations', case_locations)
      context.commit('set_case_locations_count', case_locations.length)
    },
    async get_case_locations_count(context) {
      const count = await case_locations_controller.read_count()
      context.commit('set_case_locations_count', count)
    },
    async get_case_locations_local(context) {
      const case_locations = await case_locations_controller.read_local()
      context.commit('set_case_locations', case_locations)
    },
    
    // probably shouldn't be in the store
    get_case_locations_fc(context) {
      return case_locations_controller.convert_case_locations_to_fc(context.state.case_locations)
    },
    get_case_clusters_fc(context) {
      return case_clusters_controller.convert_case_clusters_to_fc(context.state.case_clusters)
    },
    get_case_cluster_fc(context, case_cluster_id) {
      const case_cluster = context.state.case_clusters.find(c => c._id === case_cluster_id)
      return case_clusters_controller.convert_case_clusters_to_fc([case_cluster])
    }
  }
}