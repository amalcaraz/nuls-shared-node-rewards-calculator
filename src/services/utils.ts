import { balanceNumber } from './../model/common';
import { AxiosResponse } from 'axios';

export function checkResponse<T>(response: AxiosResponse<T>): T {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(response.statusText);
  }
}

export function getQueryString(data: { [k: string]: any }): string {
  const query: string = Object.keys(data).map((k: string) => `${k}=${data[k]}`).join('&');
  return query ? `?${query}` : '';
}

const nulsDecimals: number = 8;
const nulsDecimalsBase: number = Math.pow(10, nulsDecimals);

export function nulsDecimalsToInt(nuls: number): balanceNumber {
  return nuls * nulsDecimalsBase;
}

export function nulsIntToDecimals(nuls: balanceNumber): number {
  return nuls / nulsDecimalsBase;
}

export function nulsIntToDecimalsFixed(nuls: balanceNumber, fixed: number = 2): number {
  const res: number = nulsIntToDecimals(nuls);
  const fixedBase: number = Math.pow(10, fixed);
  return (Math.round(res * fixedBase) / fixedBase);
}