import { address, balanceNumber } from '@/model/common';

export interface NodeStaker {
  address: address;
  alias?: string;
  email?: string;
  staked: balanceNumber;
  profitRate?: number;
}
