import Vue from 'vue';
import Vuex from 'vuex';
import config from './modules/config';
import layout from './modules/layout';
import error from './modules/error';
import consensus from './modules/consensus';
import wallet from './modules/wallet';
import blocks from './modules/blocks';
import transactions from './modules/transactions';
import rewards from './modules/rewards';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    config,
    layout,
    error,
    consensus,
    wallet,
    blocks,
    transactions,
    rewards,
  },
});

export default store;
