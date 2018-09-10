import { balanceNumber } from './common';
import { Moment } from 'moment';
import { ConsensusAgentNode } from '@/model/consensus';
import { ConfigServerCosts } from './config';

export interface NodeRewardsFilters {
  [k: string]: any;
  node: ConsensusAgentNode;
  startDate?: number;
  endDate?: number;
}

// tslint:disable-next-line:no-empty-interface
export interface StakingRewardsFilters extends NodeRewardsFilters {
}

export interface NodeRewards {
  paymentDateRange: {
    startDate: Moment;
    endDate: Moment;
  };
  nodeBalance: balanceNumber;
  totalRewards: balanceNumber;
  stakingRewards?: balanceNumber;
  serverCosts?: ConfigServerCosts;
  totalToShare: balanceNumber;
}
