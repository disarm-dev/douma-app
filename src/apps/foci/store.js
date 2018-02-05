import {CaseClustersController} from "./lib/models/case_clusters/controller"
import {CasesController} from "./lib/models/cases/controller"

const case_clusters_controller = new CaseClustersController()
const cases_controller = new CasesController()

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
      const case_clusters = await case_clusters_controller.read_all_network()
      //
      context.commit('set_case_clusters', case_clusters)
    },
    async get_cases(context) {
      const cases = await cases_controller.read_all_network()
      //
      context.commit('set_cases', cases)
    },
    get_cases_fc(context) {
      return cases_controller.convert_cases_to_fc(context.state.cases)
    },
    get_case_clusters_fc(context) {
      return case_clusters_controller.convert_case_clusters_to_fc(context.state.case_clusters)
    }
  }
}