import { blockHeight } from './../../model/common';
import * as blocksService from '../../services/blocks';
import { address } from '@/model/common';
import { BlocksFilters, Block } from '@/model/blocks';
import { BlockList } from '../../model/blocks';
import { enhancedGetters } from 'vuex-strong-cache';

function filterBlocksByProducer(blocks: Block[], producer: address): Block[] {
  return blocks.filter((block: Block) => block.packingAddress === producer);
}

function filterBlocksByDateRange(blocks: Block[], startDate: number = 0, endDate: number = Number.MAX_SAFE_INTEGER): Block[] {
  return blocks.filter((block: Block) =>
    block.time >= startDate &&
    block.time <= endDate,
  );
}

function filterBlocksByHeightRange(blocks: Block[], startHeight: blockHeight = 0, endHeight: blockHeight = Number.MAX_SAFE_INTEGER): Block[] {
  return blocks.filter((block: Block) =>
    block.height >= startHeight &&
    block.height <= endHeight,
  );
}

function filterBlocksByFilters(blocks: Block[], filters: BlocksFilters) {

  let filteredBlocks: Block[] = blocks; // blocks.slice(0);

  if (filters.producer) {
    filteredBlocks = filterBlocksByProducer(filteredBlocks, filters.producer);
  }

  if (filters.startDate || filters.endDate) {
    filteredBlocks = filterBlocksByDateRange(filteredBlocks, filters.startDate, filters.endDate);
  }

  if (filters.startHeight || filters.endHeight) {
    filteredBlocks = filterBlocksByHeightRange(filteredBlocks, filters.startHeight, filters.endHeight);
  }

  return filteredBlocks;
}

export default {
  namespaced: true,
  state: {
    blocks: new Array<Block>(),
  },
  getters: enhancedGetters({
    blocksByProducer: (state: any) => (producer: address) => filterBlocksByProducer(state.blocks, producer),
    blocksByHeightRange: (state: any) => (startHeight: blockHeight, endHeight: blockHeight) => filterBlocksByHeightRange(state.blocks, startHeight, endHeight),
    blocksByDateRange: (state: any) => (startDate: number, endDate: number) => filterBlocksByDateRange(state.blocks, startDate, endDate),
    blocksByFilters: (state: any) => (filters: BlocksFilters) => filterBlocksByFilters(state.blocks, filters),
  }),
  mutations: {
    addBlocks(state: any, blocks: Block | Block[]) {

      // const newBlocks = []
      //   .concat.call([], blocks)
      //   .filter((newB: Block) => !state.blocks.some((storedB: Block) => storedB.height === newB.height));

      // state.blocks = [...state.blocks, ...newBlocks];

      const newBlocks = [].concat.call([], blocks);
      state.blocks = [...newBlocks];

    },
  },
  actions: {
    async fetchBlocks({ commit }: any, filters: BlocksFilters) {
      const response: BlockList = await blocksService.getBlocks(filters);
      commit('addBlocks', response.blocks);
    },
  },
};
