import {CaseClustersController} from "./lib/models/case_clusters/controller"
import {CasesController} from "./lib/models/cases/controller"

const case_clusters_controller = new CaseClustersController('foci')
const cases_controller = new CasesController('foci')

export default {
  namespaced: true,
  unpersisted_state_keys: ['cases', 'case_clusters'],
  state: {
    cases: null,
    case_clusters: null,
    case_clusters_count: null
  },
  mutations: {
    set_cases(state, cases) {
      state.cases = cases
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
    }
  },
  actions: {
    async get_case_clusters(context) {
      const case_clusters = await case_clusters_controller.read_all_network()
      context.commit('set_case_clusters', case_clusters)
    },
    async get_case_clusters_local(context) {
      const case_clusters = await case_clusters_controller.read_local()
      context.commit('set_case_clusters', case_clusters)
    },
    async get_cases(context) {
      const cases = await cases_controller.read_all_network()
      context.commit('set_cases', cases)
    },
    async get_cases_local(context) {
      const case_clusters = await cases_controller.read_local()
      context.commit('set_case_clusters', case_clusters)
    },
    get_cases_fc(context) {
      return cases_controller.convert_cases_to_fc(context.state.cases)
    },
    get_case_clusters_fc(context) {
      return case_clusters_controller.convert_case_clusters_to_fc(context.state.case_clusters)
    },
    async update_case_cluster(context, case_cluster) {
      const updated_case_cluster = await case_clusters_controller.update_case_cluster(case_cluster)
      context.commit('set_case_cluster', case_cluster)
    },
    async get_case_clusters_count(context) {
      const count = await case_clusters_controller.read_count()
      context.commit('set_case_clusters_count', count)
    }
  }
}