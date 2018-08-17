import { Moment } from 'moment';
import { balanceNumber } from '@/model/common';

export interface NodeRewards {
  paymentDateRange: {
    startDate: Moment;
    endDate: Moment;
  };
  totalRewards: balanceNumber;
  totalRewards2: balanceNumber;
}
