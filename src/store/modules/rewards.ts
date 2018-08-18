import { balanceNumber } from '../../model/common';
import { ConsensusResponse } from './../../model/consensus';
import { ConsensusAgentNode, ConsensusListFilters } from '@/model/consensus';
import { TransactionsFilters, TransactionType, Transaction, TransactionOutput } from '@/model/transactions';
import { NodeRewardsFilters, StakingRewardsFilters } from '@/model/rewards';
import { BlocksFilters, Block } from '@/model/blocks';
import { calculateStakingRewardsPerRound } from '@/services/rewards';

export default {
  namespaced: true,
  getters: {
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
  },
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

      dispatch('transactions/fetchTransactions', transactionsFilters, { root: true });

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
          pagination: 0,
          agent: filters.node.agentHash,
          // heights: blocks.slice(0, blocks.length - 1).map((block: Block) => block.height).join(','),
          startHeight: blocks[blocks.length - 1].height,
          endHeight: blocks[0].height,
        };

        dispatch('consensus/fetchConsensusList', consensusListFilters, { root: true });

      }

    },
  },
};
