export default {
  namespaced: true,
  state: {
    loading: true,
  },
  mutations: {
    loading(state: any, payload: boolean) {
      state.loading = payload;
    },
  },
  getters: {
    loading: (state: any) => state.loading,
  },
};
