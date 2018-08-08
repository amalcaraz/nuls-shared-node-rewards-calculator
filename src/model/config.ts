import { DurationInputArg2 } from 'moment';
import { agentNodeId } from './common';

export interface ConfigNode {
  agentNodeId: agentNodeId;
  serverCost: number;
  paymentFreq: DurationInputArg2; // 'month' | 'week' | 'day';
  lastPaymentDate: string;
}

export interface Config {
  nodes: ConfigNode[];
}
