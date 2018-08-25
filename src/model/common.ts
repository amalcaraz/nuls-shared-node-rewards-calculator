import { Route } from 'vue-router';

export type hash = string;
export type agentNodeId = string;
export type blockHeight = number;
export type balanceNumber = number;
export type txHash = hash;
export type agentHash = hash;
export type blockHash = hash;
export type transactionHash = hash;
export type address = string;

export type AppMenu = AppMenuItem[];

export interface AppMenuItem {
  icon?: string;
  label: string;
  to?: Route;
};
