import * as blocksService from '../../services/blocks';
import { address } from '@/model/common';
import { BlocksFilters, Block } from '@/model/blocks';
import { BlockList } from '../../model/blocks';

export default {
  namespaced: true,
  state: {
    blocks: new Array<Block>(),
  },
  getters: {
    blocksByProducer: (state: any) => (producer: address) => state.blocks.filter((block: Block) => block.packingAddress === producer),
  },
  mutations: {
    addBlocks(state: any, blocks: Block | Block[]) {

      const newBlocks = []
        .concat.call([], blocks)
        .filter((newB: Block) => !state.blocks.some((storedB: Block) => storedB.height === newB.height));

      state.blocks = [...state.blocks, ...newBlocks];

    },
  },
  actions: {
    async fetchBlocks({ commit }: any, filters: BlocksFilters) {
      const response: BlockList = await blocksService.getBlocks(filters);
      commit('addBlocks', response.blocks);
    },
  },
};
