import { DurationInputArg2 } from 'moment';
import { agentNodeId } from './common';

export interface ConfigNode {
  agentNodeId: agentNodeId;
  serverCosts?: ConfigServerCosts;
  paymentFreq?: DurationInputArg2; // 'month' | 'week' | 'day';
  lastPaymentDate?: string;
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
