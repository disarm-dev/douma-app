import {CaseClustersController} from "./lib/models/case_clusters/controller"
import {CaseLocationsController} from "./lib/models/case_locations/controller"

const case_clusters_controller = new CaseClustersController('foci')
const case_locations_controller = new CaseLocationsController('foci')

export default {
  namespaced: true,
  unpersisted_state_keys: ['case_locations', 'case_clusters', 'case_clusters_count', 'case_locations_count'],
  state: {
    case_locations: null,
    case_clusters: null,
    case_clusters_count: null,
    case_locations_count: null
  },
  mutations: {
    set_case_locations(state, case_locations) {
      state.case_locations = case_locations
    },
    set_case_clusters(state, case_clusters) {
      state.case_clusters = case_clusters
    },
    set_case_cluster(state, incoming_case_cluster) {
      const index = state.case_clusters.find(cluster => cluster._id === incoming_case_cluster._id)
      state.case_clusters.splice(index, 1, incoming_case_cluster)
    },
    set_case_clusters_count(state, count) {
      state.case_clusters_count = count
    },
    set_case_locations_count(state, count) {
      state.case_locations_count = count
    }
  },
  actions: {
    async get_case_clusters(context) {
      const case_clusters = await case_clusters_controller.read_all_network()
      context.commit('set_case_clusters', case_clusters)
      context.commit('set_case_clusters_count', case_clusters.length)
    },
    async get_case_clusters_local(context) {
      const case_clusters = await case_clusters_controller.read_local()
      context.commit('set_case_clusters', case_clusters)
    },
    async get_case_locations(context) {
      const case_locations = await case_locations_controller.read_all_network()
      context.commit('set_case_locations', case_locations)
      context.commit('set_case_locations_count', case_locations.length)
    },
    async get_case_locations_local(context) {
      const case_locations = await case_locations_controller.read_local()
      context.commit('set_case_locations', case_locations)
    },
    get_case_locations_fc(context) {
      return case_locations_controller.convert_case_locations_to_fc(context.state.case_locations)
    },
    get_case_clusters_fc(context) {
      return case_clusters_controller.convert_case_clusters_to_fc(context.state.case_clusters)
    },
    get_case_cluster_fc(context, case_cluster_id) {
      const case_cluster = context.state.case_clusters.find(c => c._id === case_cluster_id)
      return case_clusters_controller.convert_case_clusters_to_fc([case_cluster])
    },
    async update_case_cluster(context, case_cluster) {
      const updated_case_cluster = await case_clusters_controller.update_case_cluster(case_cluster)
      context.commit('set_case_cluster', case_cluster)
    },
    async get_case_clusters_count(context) {
      const count = await case_clusters_controller.read_count()
      context.commit('set_case_clusters_count', count)
    },
    async get_case_locations_count(context) {
      const count = await case_locations_controller.read_count()
      context.commit('set_case_locations_count', count)
    }
  }
}