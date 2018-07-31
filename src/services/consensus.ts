import config from 'config';
import axios, { AxiosResponse } from 'axios';
import { ConsensusAgentNodeListResponse } from '@/model/consensus';

const api = config.app.api.nulsWorld;
const baseUrl: string = `${api.host}:${api.port}${api.base}`;

export async function getConsensusNodeList(): Promise<ConsensusAgentNodeListResponse> {

  const url: string = `${baseUrl}${api.resources.getNodes}`;
  return await axios.get<ConsensusAgentNodeListResponse>(url).then(_checkResponse);

}

function _checkResponse<T>(response: AxiosResponse<T>): T {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(response.statusText);
  }
}
