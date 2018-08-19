import * as priceService from '../../services/price';
import { NulsPriceResponse } from '../../model/price';

export default {
  namespaced: true,
  state: {
    price: null as NulsPriceResponse | null,
  },
  getters: {
    price: (state: any) => state.price,
  },
  mutations: {
    updatePrice(state: any, price: NulsPriceResponse) {
      state.price = price;
    },
  },
  actions: {
    async fetchPrice({ commit }: any) {
      const price: NulsPriceResponse = await priceService.getNulsPrice();
      commit('updatePrice', price);
    },
  },
};
