import { balanceNumber } from './common';
import { ConfigServerCosts } from './config';

export interface NulsPriceCurrencyPrice {
  price: number;
  volume_24h: number;
  market_cap: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
}

export interface NulsPriceResponse {
  data: {
    id: 2092;
    name: 'Nuls';
    symbol: 'NULS';
    website_slug: 'nuls';
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    quotes: {
      [k: string]: NulsPriceCurrencyPrice;
    };
    last_updated: number;
  };
  metadata: {
    timestamp: number;
    error: any;
  };
}

export interface ServerCostsPrice extends ConfigServerCosts {
  nulsPrice: balanceNumber;
}
