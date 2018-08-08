import config from 'config';
import axios, { AxiosResponse } from 'axios';
import { BlocksFilters, BlockList } from '@/model/blocks';

const api = config.app.api.nulsWorld;
const baseUrl: string = `${api.host}:${api.port}${api.base}`;

export async function getBlocks(filters: BlocksFilters = {}): Promise<BlockList> {

  const queryString: string = getQueryString(filters);

  const url: string = `${baseUrl}${api.resources.getBlocks}${queryString}`;
  return (await axios.get<BlockList>(url).then(_checkResponse));

}

function _checkResponse<T>(response: AxiosResponse<T>): T {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(response.statusText);
  }
}

function getQueryString(data: { [k: string]: any }): string {
  const query: string = Object.keys(data).map((k: string) => `${k}=${data[k]}`).join('&');
  return query ? `?${query}` : '';
}
