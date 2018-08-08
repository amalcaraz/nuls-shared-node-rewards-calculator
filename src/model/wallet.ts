import { address, balanceNumber, blockNumber } from './common';
import { ConsensusTransaction } from './consensus';

export interface WalletDetail {
  address: address;
  last_height: blockNumber;
  mode: string;
  pagination_item: string;
  pagination_page: number;
  pagination_per_page: number;
  pagination_total: number;
  transactions: ConsensusTransaction[];
  tx_count: number;
  unspent_info: {
    _id: address;
    available_value: balanceNumber
    consensus_locked_value: balanceNumber
    locked_value: balanceNumber
    time_locked_value: balanceNumber
    unspent_count: number
    unspent_value: balanceNumber
  };
}
