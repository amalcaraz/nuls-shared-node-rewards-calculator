import * as walletService from '../../services/wallet';
import { WalletDetail } from '@/model/wallet';
import { address } from '@/model/common';

export default {
  namespaced: true,
  state: {
    wallets: {} as Record<address, WalletDetail>,
  },
  getters: {
    walletByAddress: (state: any) => (addr: address) => state.wallets[addr],
  },
  mutations: {
    addWallet(state: any, { walletDetail }: { walletDetail: WalletDetail }) {
      state.wallets = {
        ...state.wallets,
        [walletDetail.address]: walletDetail,
      };
    },
  },
  actions: {
    async fetchWalletDetail({ commit }: any, walletAddress: address) {
      const response: WalletDetail = await walletService.getWalletDetail(walletAddress);
      commit('addWallet', { walletDetail: response });
    },
  },
};
