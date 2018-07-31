export type agentNodeId = string;
export type blockNumber = string;
export type balanceNumber = number;
export type txHash = string;
export type agentHash = string;
export type address = string;

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

export interface ConsensusAgentNodeListResponse {
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
