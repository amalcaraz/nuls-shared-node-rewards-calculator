import { ConsensusAgentNode } from '@/model/consensus';
import { TransactionsFilters, TransactionType, Transaction, TransactionOutput } from '@/model/transactions';

export default {
  namespaced: true,
  getters: {
    agentNodeRewardsByDateRange: (state: any, getters: any, rootState: any, rootGetters: any) =>
      (node: ConsensusAgentNode, startDate: number, endDate: number) => {

        const lastHeight: number = rootGetters['transactions/lastHeight'];
        const txs: Transaction[] = rootGetters['transactions/txsByFilters']({
          to: node.rewardAddress,
          type: TransactionType.Reward,
          startDate,
          endDate,
        } as TransactionsFilters);

        return txs.reduce((prev: number, currentTx: Transaction) => {

          const outputData: TransactionOutput | undefined = currentTx.outputs.find((output: TransactionOutput) =>
            output.address === node.rewardAddress &&
            output.status === 1 &&
            output.lockTime <= lastHeight,
          );

          return prev + (outputData ? outputData.value : 0);

        }, 0);

      },
  },
};
