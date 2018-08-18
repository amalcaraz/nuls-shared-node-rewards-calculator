import config from 'config';
import axios from 'axios';
import { checkResponse, getQueryString } from './utils';
import { ConsensusResponse, agentHash, ConsensusAgentNode, ConsensusSummary, ConsensusListFilters, ConsensusListResponse } from '../model/consensus';


const api = config.app.api.nulsWorld;
const baseUrl: string = `${api.host}:${api.port}${api.base}`;

export async function getConsensusSummary(): Promise<ConsensusSummary> {

  const url: string = `${baseUrl}${api.resources.getNodes}`;
  const response: ConsensusResponse = await axios.get<ConsensusResponse>(url).then(checkResponse);

  return {
    lastHeight: response.last_height,
    totalAgentNodes: response.node_count,
    totalActiveAgentNodes: response.active_count,
    totalDeposits: response.total_deposit,
  };

}

export async function getConsensusList(filters: ConsensusListFilters = {}): Promise<ConsensusResponse[]> {

  const queryString: string = getQueryString(filters);

  const url: string = `${baseUrl}${api.resources.getConsensusList}${queryString}`;
  return (await axios.get<ConsensusListResponse>(url).then(checkResponse)).consensus_list;

}

export async function getConsensusNodeList(): Promise<ConsensusAgentNode[]> {

  const url: string = `${baseUrl}${api.resources.getNodes}`;
  return (await axios.get<ConsensusResponse>(url).then(checkResponse)).consensus.agents;

}

export async function getConsensusNodeDetail(nodeHash: agentHash): Promise<ConsensusAgentNode | undefined> {

  const agentNodes: ConsensusAgentNode[] = await getConsensusNodeList();
  return agentNodes.find((agentNode: ConsensusAgentNode) => agentNode.agentHash === nodeHash);

  // const url: string = `${baseUrl}${api.resources.getNodeDetail}`.replace(/__NODE_HASH__/, nodeHash);
  // return await axios.get<ConsensusResponse>(url).then(_checkResponse);

}
