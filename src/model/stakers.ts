import { balanceNumber } from './common';
import { ConfigStaker } from '@/model/config';

export interface NodeFixedStaker extends ConfigStaker {
  staked: balanceNumber;
  totalRewards: balanceNumber;
}

export interface NodeAutoStaker extends ConfigStaker {
  stakingRewards: balanceNumber;
  totalRewards: balanceNumber;
}

export type NodeStaker = NodeFixedStaker | NodeAutoStaker;