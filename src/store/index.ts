import Vue from 'vue';
import Vuex from 'vuex';
import error from './modules/error';
import consensus from './modules/consensus';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    error,
    consensus,
  },
});

export default store;
