import { TransactionType } from './../../model/transactions';
import { address } from './../../model/common';
import * as txsService from '../../services/transactions';
import {
  TransactionList,
  TransactionsFilters,
  Transaction,
  TransactionInput,
  TransactionOutput,
} from '../../model/transactions';


function filterTransactionsByAddress(txs: Transaction[], addr: address): Transaction[] {
  return txs.filter((tx: Transaction) =>
    tx.inputs.some((input: TransactionInput) => input.address === addr) ||
    tx.outputs.some((output: TransactionOutput) => output.address === addr),
  );
}

function filterTransactionsByFrom(txs: Transaction[], addr: address): Transaction[] {
  return txs.filter((tx: Transaction) => tx.inputs.some((input: TransactionInput) => input.address === addr));
}

function filterTransactionsByTo(txs: Transaction[], addr: address): Transaction[] {
  return txs.filter((tx: Transaction) => tx.outputs.some((output: TransactionOutput) => output.address === addr));
}

function filterTransactionsByType(txs: Transaction[], type: TransactionType): Transaction[] {
  return txs.filter((tx: Transaction) => tx.type === type);
}

function filterTransactionsByDateRange(txs: Transaction[], startDate: number = 0, endDate: number = Number.MAX_SAFE_INTEGER): Transaction[] {
  return txs.filter((tx: Transaction) =>
    tx.time >= startDate &&
    tx.time <= endDate,
  );
}

function filterTransactionsByFilters(txs: Transaction[], filters: TransactionsFilters) {

  let filteredTxs: Transaction[] = txs.slice(0);

  if (filters.address) {
    filteredTxs = filterTransactionsByAddress(filteredTxs, filters.address);
  }

  if (filters.from) {
    filteredTxs = filterTransactionsByFrom(filteredTxs, filters.from);
  }

  if (filters.to) {
    filteredTxs = filterTransactionsByTo(filteredTxs, filters.to);
  }

  if (filters.type) {
    filteredTxs = filterTransactionsByType(filteredTxs, filters.type);
  }

  if (filters.startDate || filters.endDate) {
    filteredTxs = filterTransactionsByDateRange(filteredTxs, filters.startDate, filters.endDate);
  }

  return filteredTxs;
}

export default {
  namespaced: true,
  state: {
    lastHeight: -1,
    txs: new Array<Transaction>(),
  },
  getters: {
    lastHeight: (state: any) => state.lastHeight,
    txsByAddress: (state: any) => (addr: address) => filterTransactionsByAddress(state.txs, addr),
    txsByFrom: (state: any) => (addr: address) => filterTransactionsByFrom(state.txs, addr),
    txsByTo: (state: any) => (addr: address) => filterTransactionsByTo(state.txs, addr),
    txsByType: (state: any) => (type: TransactionType) => filterTransactionsByType(state.txs, type),
    txsByDateRange: (state: any) => (startDate: number, endDate: number) => filterTransactionsByDateRange(state.txs, startDate, endDate),
    txsByFilters: (state: any) => (filters: TransactionsFilters) => filterTransactionsByFilters(state.txs, filters),
  },
  mutations: {
    updateLastHeight(state: any, height: number) {
      if (height > state.lastHeight) {
        state.lastHeight = height;
      }
    },
    addTransactions(state: any, txs: Transaction | Transaction[]) {

      const newTransactions = []
        .concat.call([], txs)
        .filter((newTx: Transaction) => !state.txs.some((storedTx: Transaction) => storedTx.hash === newTx.hash));

      state.txs = [...state.txs, ...newTransactions];

    },
  },
  actions: {
    async fetchTransactions({ commit }: any, filters: TransactionsFilters) {
      const response: TransactionList = await txsService.getTransactions(filters);
      commit('addTransactions', response.transactions);
      commit('updateLastHeight', response.last_height);
    },
  },
};
