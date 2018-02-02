import {CaseClustersController} from "../../lib/models/case_clusters/controller"

// const case_cluster_controler = new CaseClustersController()

export default {
  namespaced: true,
  state: {
    cases: null,
    case_clusters: null
  },
  mutations: {},
  actions: {
    async get_case_clusters() {
      // const case_clusters = await case_cluster_controler.read_all_network()
      //
      // console.log('case_clusters', case_clusters)
    },
    get_cases() {

    }
  }
}