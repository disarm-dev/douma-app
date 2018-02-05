import {CaseClustersController} from "./lib/models/case_clusters/controller"
import {CasesController} from "./lib/models/cases/controller"

const case_cluster_controler = new CaseClustersController()
const cases_controler = new CasesController()

export default {
  namespaced: true,
  state: {
    cases: null,
    case_clusters: null
  },
  mutations: {
    set_cases(state, cases) {
      state.cases = cases
    },
    set_case_clusters(state, case_clusters) {
      state.case_clusters = case_clusters
    }
  },
  actions: {
    async get_case_clusters(context) {
      const case_clusters = await case_cluster_controler.read_all_network()
      //
      context.commit('set_case_clusters', case_clusters)
    },
    async get_cases(context) {
      const cases = await cases_controler.read_all_network()
      //
      context.commit('set_cases', cases)
    }
  }
}