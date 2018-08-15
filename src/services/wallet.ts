import config from 'config';
import axios from 'axios';
import { checkResponse } from './utils';
import { address } from '../model/common';
import { WalletDetail } from '../model/wallet';

const api = config.app.api.nulsWorld;
const baseUrl: string = `${api.host}:${api.port}${api.base}`;

export async function getWalletDetail(addr: address): Promise<WalletDetail> {

  const url: string = `${baseUrl}${api.resources.getAddressDetail}`.replace(/__ADDRESS__/, addr);
  return (await axios.get<WalletDetail>(url).then(checkResponse));

}
