import config from 'config';
import axios from 'axios';
import { BlocksFilters, BlockList } from '../model/blocks';
import { checkResponse, getQueryString } from './utils';

const api = config.app.api.nulsWorld;
const baseUrl: string = `${api.host}:${api.port}${api.base}`;

export async function getBlocks(filters: BlocksFilters = {}): Promise<BlockList> {

  const queryString: string = getQueryString(filters);

  const url: string = `${baseUrl}${api.resources.getBlocks}${queryString}`;
  return (await axios.get<BlockList>(url).then(checkResponse));

}
