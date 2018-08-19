import { address, balanceNumber, hash, blockHeight, transactionHash, txHash, agentHash } from './common';


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

export enum TransactionStatus {
  UnspentFree = 0,
  UnspentLocked = 1,
  Unspent = 2,
  Spent = 3,
}

export interface TransactionInput {
  value: balanceNumber;
  lockTime: number;
  fromHash: hash;
  fromIndex: number;
  address: address;
}

export interface TransactionOutput {
  value: balanceNumber;
  lockTime: number;
  address: address;
  status: TransactionStatus;
}

export interface BaseTransaction {
  _id: {
    $oid: string;
  };
  hash: transactionHash;
  type: TransactionType;
  time: number;
  blockHeight: blockHeight;
  fee: balanceNumber;
  remark: any;
  scriptSig: string;
  size: number;
  info?: {};
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
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

export interface AliasedTransaction extends BaseTransaction {
  info: {
    address: {
      $binary: string;
      $type: number;
    };
    alias: string;
  };
}

export interface RegisterTransaction extends BaseTransaction {
  info: {
    deposit: balanceNumber;
    agentAddress: address;
    packingAddress: address;
    rewardAddress: address;
    commissionRate: number;
  };
}

export interface DepositTransaction extends BaseTransaction {
  info: {
    deposit: balanceNumber;
    address: address;
    agentHash: agentHash;
  };
}

export interface WithdrawTransaction extends BaseTransaction {
  info: {
    joinTxHash: txHash;
    address: address;
    agentHash: agentHash;
  };
}

export interface RedYellowCardTransaction extends BaseTransaction {
  info: {
    count: number,
    addresses: address[];
  };
}

export interface TransactionList {
  transactions: Transaction[];
  last_height: blockHeight;
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
  maskByAddress?: address;
  pagination?: number;
  startDate?: number;
  endDate?: number;
  type?: TransactionType;
}
