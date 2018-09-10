import { DurationInputArg2 } from 'moment';
import { agentNodeId, address, balanceNumber } from './common';

export interface ConfigNode {
  agentNodeId: agentNodeId;
  configType?: ConfigType;
  ownerStaking?: boolean;
  reimburseFees?: number;
  serverCosts?: ConfigServerCosts;
  paymentFreq?: DurationInputArg2; // 'month' | 'week' | 'day';
  lastPaymentDate?: string;
  stakers?: ConfigStaker[];
}

export interface Config {
  nodes?: ConfigNode[];
}

export enum ConfigCurrencyType {
  USD = 'USD',
  EUR = 'EUR',
  NULS = 'NULS',
}

export interface ConfigServerCosts {
  currency: ConfigCurrencyType;
  price: number;
}

export interface ConfigStaker {
  address: address;
  staked?: balanceNumber;
  alias?: string;
  email?: string;
}

export enum ConfigType {
  FixedStakingPool = 0,
  AutoStaking = 1,
}

export interface ConfigTypeMap {
  type: ConfigType;
  label: string;
  description: string;
}

export const CONFIG_TYPES: ConfigTypeMap[] = [
  { type: ConfigType.FixedStakingPool, label: 'Fixed staking pool', description: `
    The node total rewards will be proportionally distributed between a list of fixed stakers manually added
  `},
  { type: ConfigType.AutoStaking, label: 'Auto calculate stakers', description: `
    A list of stakers and their rewards will be automatically calculated reading data from nuls blockchain
  `},
];
