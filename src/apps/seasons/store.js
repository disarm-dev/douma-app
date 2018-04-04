export default {
  namespaced: true,
  state: {
    previous_route: ''
  },
  getters: {
    irs_seasons(state, getters, rootState) {
      //debugger
      return rootState.instance_config.applets.irs_monitor.season_start_dates
    }
  },
  mutations:{

  }
}
