import { address, balanceNumber, blockNumber, hash, blockHash } from './common';

export interface Block {
  _id: {
    $oid: string;
  };
  hash: blockHash;
  preHash: hash;
  merkleHash: hash;
  time: number;
  height: blockNumber;
  txCount: number;
  packingAddress: address;
  roundIndex: number;
  consensusMemberCount: number;
  roundStartTime: number;
  packingIndexOfRound: number;
  reward: balanceNumber;
  fee: balanceNumber;
  confirmCount: number;
  size: number;
  scriptSig: string;
  extend: string;
}

export interface BlockList {
  blocks: Block[];
  last_height: blockNumber;
  pagination_page: number;
  pagination_total: number;
  pagination_per_page: number;
  pagination_item: 'blocks';
}

export interface WalletRewards {
  totalRewards: balanceNumber;
  nodes: any;
}

export interface BlocksFilters {
  [k: string]: any;
  producer?: address;
  pagination?: number;
  startDate?: number;
  endDate?: number;
}
