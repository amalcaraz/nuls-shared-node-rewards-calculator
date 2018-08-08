import config from 'config';
import axios, { AxiosResponse } from 'axios';
import { address } from '../model/common';
import { WalletDetail } from '../model/wallet';

const api = config.app.api.nulsWorld;
const baseUrl: string = `${api.host}:${api.port}${api.base}`;

export async function getWalletDetail(addr: address): Promise<WalletDetail> {

  const url: string = `${baseUrl}${api.resources.getAddressDetail}`.replace(/__ADDRESS__/, addr);
  return (await axios.get<WalletDetail>(url).then(_checkResponse));

}

function _checkResponse<T>(response: AxiosResponse<T>): T {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(response.statusText);
  }
}
