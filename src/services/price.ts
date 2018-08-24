import { balanceNumber } from '@/model/common';
import config from 'config';
import axios from 'axios';
import { checkResponse, nulsDecimalsToInt } from './utils';
import { NulsPriceResponse } from '../model/price';
import { ConfigCurrencyType } from '@/model/config';

const api = config.app.api.coinmarketcap;
const baseUrl: string = `${api.host}:${api.port}${api.base}`;

export async function getNulsPrice(): Promise<NulsPriceResponse> {

  const url: string = `${baseUrl}${api.resources.getNulsPrice}`;
  return (await axios.get<NulsPriceResponse>(url).then(checkResponse));

}

export function calculateNulsPrice(currencyPrice: number, currency: ConfigCurrencyType, nulsPriceResponse?: NulsPriceResponse): balanceNumber {

  const currentPrice: number = currencyPrice ? currencyPrice : 0;
  let nulsPrice: balanceNumber = 0;

  switch (ConfigCurrencyType[currency]) {

    case ConfigCurrencyType.NULS:

      nulsPrice = nulsDecimalsToInt(currentPrice);
      break;

    default:

      if (currentPrice > 0 && nulsPriceResponse) {

        nulsPrice = nulsDecimalsToInt(currentPrice / nulsPriceResponse.data.quotes[currency].price);

      }

  }

  return nulsPrice;

}
