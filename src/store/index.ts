import Vue from 'vue';
import Vuex from 'vuex';
import layout from './modules/layout';
import error from './modules/error';
import consensus from './modules/consensus';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    layout,
    error,
    consensus,
  },
});

export default store;
