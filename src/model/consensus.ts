import { agentHash, address, balanceNumber, blockNumber, txHash, agentNodeId, hash } from './common';
import { Block } from './blocks';
import { BaseTransaction, Transaction } from '@/model/transactions';

export { agentHash } from './common';

export interface ConsensusStat {
  _id: number;
  totalDeposit: number;
  deposit: number;
  activeNodes: number;
}

export enum ConsensusAgentNodeStatus {
  waiting = 0,
  running = 1,
}

export enum ConsensusAgentNodeCredit {
  min = 0,
  med = 0.01,
  max = 0.8,
}

export interface ConsensusAgentNode {
  agentHash: agentHash;
  agentAddress: address;
  packingAddress: address;
  rewardAddress: address;
  deposit: balanceNumber;
  commissionRate: number;
  agentName: string;
  agentId: agentNodeId;
  introduction: any;
  time: number;
  blockHeight: blockNumber;
  delHeight: number;
  status: ConsensusAgentNodeStatus;
  creditVal: number;
  totalDeposit: balanceNumber;
  txHash: txHash;
  memberCount: number;
}

export interface ConsensusSummary {
  lastHeight: blockNumber;
  totalAgentNodes: number;
  totalActiveAgentNodes: number;
  totalDeposits: balanceNumber;
}

export interface ConsensusResponse {
  consensus: {
    _id: {
      $oid: string;
    };
    height: blockNumber;
    agents: ConsensusAgentNode[];
  };
  last_height: blockNumber;
  total_all: { [address: string]: number };
  total_hour: { [address: string]: number };
  total_day: { [address: string]: number };
  node_count: number;
  active_count: number;
  total_deposit: number;
  stats: ConsensusStat[];
  stats_heights: blockNumber[];
  stats_stacked_values: number[];
  stats_active_nodes: number[];
}


// DETAIL

export interface ConsensusTransaction extends BaseTransaction {
  info: {
    deposit: balanceNumber;
    address: address;
    agentHash: hash;
  };
  outputs: Array<{
    value: balanceNumber;
    lockTime: number;
    address: address;
    status: number;
    addressHash: {
      $binary: string;
      $type: string;
    };
  }>;
  is_complex: boolean;
  display_type: string;
  value: balanceNumber;
  source: address;
  target: any;
}

export interface AgentNodeDetail {
  agent: ConsensusAgentNode;
  transaction: Transaction;
  block: Block;
  consensus: {
    _id: {
      $oid: string;
    },
    height: blockNumber;
    agents: ConsensusAgentNode[];
    transactions: ConsensusTransaction[];
    last_height: blockNumber;
    tx_count: number;
    mode: string; // "summary";
    pagination_page: number;
    pagination_total: number;
    pagination_per_page: number;
    pagination_item: string; // "transactions";
    stats: Array<{
      _id: number;
      totalDeposit: balanceNumber;
      deposit: balanceNumber;
      activeNodes: number;
    }>;
    stats_heights: number[];
    stats_stacked_values: number[]
  };
}
