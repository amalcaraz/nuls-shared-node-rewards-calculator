import config from 'config';
import axios, { AxiosResponse } from 'axios';
import { ConsensusResponse, agentHash, ConsensusAgentNode, ConsensusSummary } from '@/model/consensus';


const api = config.app.api.nulsWorld;
const baseUrl: string = `${api.host}:${api.port}${api.base}`;

export async function getConsensusSummary(): Promise<ConsensusSummary> {

  const url: string = `${baseUrl}${api.resources.getNodes}`;
  const response: ConsensusResponse = await axios.get<ConsensusResponse>(url).then(_checkResponse);

  return {
    lastHeight: response.last_height,
    totalAgentNodes: response.node_count,
    totalActiveAgentNodes: response.active_count,
    totalDeposits: response.total_deposit,
  };

}

export async function getConsensusNodeList(): Promise<ConsensusAgentNode[]> {

  const url: string = `${baseUrl}${api.resources.getNodes}`;
  return (await axios.get<ConsensusResponse>(url).then(_checkResponse)).consensus.agents;

}

export async function getConsensusNodeDetail(nodeHash: agentHash): Promise<ConsensusAgentNode | undefined> {

  const agentNodes: ConsensusAgentNode[] = await getConsensusNodeList();
  return agentNodes.find((agentNode: ConsensusAgentNode) => agentNode.agentHash === nodeHash);

  // const url: string = `${baseUrl}${api.resources.getNodeDetail}`.replace(/__NODE_HASH__/, nodeHash);
  // return await axios.get<ConsensusResponse>(url).then(_checkResponse);

}

function _checkResponse<T>(response: AxiosResponse<T>): T {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(response.statusText);
  }
}
