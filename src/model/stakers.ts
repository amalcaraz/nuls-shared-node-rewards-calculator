import { balanceNumber } from './common';
import { ConfigStaker } from '@/model/config';

export interface NodeStaker extends ConfigStaker {
  totalRewards?: balanceNumber;
}
