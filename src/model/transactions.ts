import { address, balanceNumber, hash, blockNumber, transactionHash } from './common';


export enum TransactionType {
  Reward = 1,     // consensus reward
  Transfer = 2,   // transfer transaction
  Aliased = 3,    // set alias
  Register = 4,   // register consensus node
  Deposit = 5,    // join consensus
  Withdraw = 6,   // cancel consensus
  YellowCard = 7, // yellow card
  RedCard = 8,    // red card
  Unregister = 9, // unregister consensus node
}

export interface BaseTransaction {
  _id: {
    $oid: string;
  };
  hash: transactionHash;
  type: TransactionType;
  time: number;
  blockHeight: blockNumber;
  fee: balanceNumber;
  remark: any;
  scriptSig: string;
  size: number;
  info: {
    deposit?: balanceNumber;
  };
  inputs: Array<{
    value: balanceNumber;
    lockTime: number;
    fromHash: hash;
    fromIndex: number;
    address: address;
  }>;
  outputs: Array<{
    value: balanceNumber;
    lockTime: number;
    address: address;
    status: number
  }>;
}

export interface Transaction extends BaseTransaction {
  info: {
    deposit?: balanceNumber;
    agentAddress?: address;
    packingAddress?: address;
    rewardAddress?: address;
    commissionRate?: number
  };
}

export interface TransactionList {
  transactions: Transaction[];
  last_height: blockNumber;
  pagination_page?: number;
  pagination_total?: number;
  pagination_per_page?: number;
  pagination_item?: 'transactions';
}

export interface TransactionsFilters {
  [k: string]: any;
  address?: address;
  from?: address;
  to?: address;
  pagination?: number;
  startDate?: number;
  endDate?: number;
  type?: TransactionType;
}
