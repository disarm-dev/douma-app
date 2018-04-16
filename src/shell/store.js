export default {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    set_user: (state, user) => {
      state.user = user
    },
  }
}
