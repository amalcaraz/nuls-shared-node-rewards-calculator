import { NulsPriceResponse } from './../../model/price';
import { balanceNumber } from '../../model/common';
import { ConsensusResponse } from './../../model/consensus';
import { ConsensusAgentNode, ConsensusListFilters } from '@/model/consensus';
import { TransactionsFilters, TransactionType, Transaction, TransactionOutput } from '@/model/transactions';
import { NodeRewardsFilters, StakingRewardsFilters } from '@/model/rewards';
import { BlocksFilters, Block } from '@/model/blocks';
import { calculateStakingRewardsPerRound } from '@/services/rewards';
import { calculateNulsPrice } from '@/services/price';
import { ConfigServerCosts } from '@/model/config';
import { ServerCostsPrice } from '../../model/price';
import config from 'config';
import { enhancedGetters } from 'vuex-strong-cache';


export default {
  namespaced: true,
  getters: enhancedGetters({
    agentNodeRewardsByDateRange: (state: any, getters: any, rootState: any, rootGetters: any) =>
      (node: ConsensusAgentNode, startDate: number, endDate: number): balanceNumber => {

        // const lastHeight: number = rootGetters['transactions/lastHeight'];

        const txs: Transaction[] = rootGetters['transactions/txsByFilters']({
          to: node.rewardAddress,
          type: TransactionType.Reward,
          startDate,
          endDate,
        } as TransactionsFilters);

        return txs.reduce((totalRewards: balanceNumber, currentTx: Transaction) => {

          // Calculate all the rewards, even timeLocked and spent (we dont care if balance is 0 calculating rewards)
          const outputData: TransactionOutput | undefined = currentTx.outputs.find((output: TransactionOutput) =>
            output.address === node.rewardAddress,
            // output.status !== TransactionStatus.Spent &&
            // output.lockTime <= lastHeight,
          );

          return totalRewards + (outputData ? outputData.value : 0);

        }, 0);

      },

    nodeStakingRewardsByDateRange: (state: any, getters: any, rootState: any, rootGetters: any) =>
      (node: ConsensusAgentNode, startDate: number, endDate: number): balanceNumber => {

        let perRoundRewardsAverage: balanceNumber = 0;

        const blocks: Block[] = rootGetters['blocks/blocksByFilters']({
          producer: node.packingAddress,
          startDate,
          endDate,
        } as BlocksFilters);

        if (blocks.length > 0) {

          const consensusList: ConsensusResponse[] = rootGetters['consensus/consensusListByFilters']({
            agent: node.agentHash,
            startHeight: blocks[blocks.length - 1].height,
            endHeight: blocks[0].height,
          } as ConsensusListFilters);

          perRoundRewardsAverage = calculateStakingRewardsPerRound(node, blocks, consensusList);

        }

        const nodeCommission: number = 1 - (node.commissionRate / 100);
        return node.deposit * perRoundRewardsAverage * blocks.length * nodeCommission;

      },

    nodeServerCosts: (state: any, getters: any, rootState: any, rootGetters: any) =>
      (node: ConsensusAgentNode, startDate: number, endDate: number): ServerCostsPrice => {

        const price: NulsPriceResponse = rootGetters['price/price'];

        const confiServerCosts: ConfigServerCosts = rootGetters['config/serverCosts'](
          node.agentId,
        );

        return {
          ...confiServerCosts,
          nulsPrice: confiServerCosts && price ? calculateNulsPrice(confiServerCosts.price, confiServerCosts.currency, price) : 0,
        };

      },
  }),
  actions: {
    async fetchNodeRewards({ dispatch }: any, filters: NodeRewardsFilters) {

      const transactionsFilters: TransactionsFilters = {
        pagination: 0,
        to: filters.node.rewardAddress,
        maskByAddress: filters.node.rewardAddress,
        type: TransactionType.Reward,
        startDate: filters.startDate,
        endDate: filters.endDate,
      };

      await dispatch('transactions/fetchTransactions', transactionsFilters, { root: true });

    },
    async fetchNodeStakingRewards({ dispatch, rootGetters }: any, filters: StakingRewardsFilters) {

      const blocksFilters: BlocksFilters = {
        pagination: 0, // config.app.stakingRewardsBlocksAverage, // 200
        producer: filters.node.packingAddress,
        startDate: filters.startDate,
        endDate: filters.endDate,
      };

      await dispatch('blocks/fetchBlocks', blocksFilters, { root: true });

      const blocks: Block[] = rootGetters['blocks/blocksByFilters'](blocksFilters);

      if (blocks.length > 0) {

        const consensusListFilters: ConsensusListFilters = {
          pagination: config.app.stakingRewardsBlocksAverage,
          agent: filters.node.agentHash,
          heights: blocks.slice(0, config.app.stakingRewardsBlocksAverage).map((block: Block) => block.height).join(','),
          // startHeight: blocks[blocks.length - 1].height,
          // endHeight: blocks[0].height,
        };

        await dispatch('consensus/fetchConsensusList', consensusListFilters, { root: true });

      }

    },
    async fetchNodeServerCosts({ dispatch, rootGetters }: any, node: ConsensusAgentNode) {
      await dispatch('price/fetchPrice', undefined, { root: true });
    },
  },
};
