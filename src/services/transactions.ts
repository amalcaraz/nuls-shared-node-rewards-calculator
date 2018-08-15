import config from 'config';
import axios from 'axios';
import { checkResponse, getQueryString } from './utils';
import { TransactionsFilters, TransactionList } from '@/model/transactions';

const api = config.app.api.nulsWorld;
const baseUrl: string = `${api.host}:${api.port}${api.base}`;

export async function getTransactions(filters: TransactionsFilters = {}): Promise<TransactionList> {

  const queryString: string = getQueryString(filters);

  const url: string = `${baseUrl}${api.resources.getTransactions}${queryString}`;
  return (await axios.get<TransactionList>(url).then(checkResponse));

}
