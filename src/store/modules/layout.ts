export default {
  namespaced: true,
  state: {
    loading: true,
    reloadClaim: false,
  },
  getters: {
    loading: (state: any) => state.loading,
    reloadClaim: (state: any) => state.reloadClaim,
  },
  mutations: {
    setLoading(state: any, payload: boolean) {
      state.loading = payload;
    },
    setReloadClaim(state: any, payload: boolean) {
      state.reloadClaim = payload;
    },
  },
};
