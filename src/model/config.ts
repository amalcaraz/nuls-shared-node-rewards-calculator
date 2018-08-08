import { Moment } from 'moment';
import { agentNodeId } from './common';

export interface ConfigNode {
  agentNodeId: agentNodeId;
  serverCost: number;
  paymentFreq: 'month' | 'week' | 'day';
  lastPaymentDate: string;
}

export interface Config {
  nodes: ConfigNode[];
}
