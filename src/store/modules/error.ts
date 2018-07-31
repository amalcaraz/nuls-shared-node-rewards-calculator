export default {
  state: {
    error: '',
  },
  mutations: {
    error(state: any, payload: any) {
      state.error = '' + payload;
    },
  },
  getters: {
    error(state: any) {
      return state.error;
    },
  },
};
