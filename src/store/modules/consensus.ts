import config from 'config';
import * as consensusService from '../../services/consensus';
import { ConsensusAgentNodeListResponse, ConsensusAgentNode } from '@/model/consensus';

export default {
  namespaced: true,
  state: {
    agentNodes: new Array<ConsensusAgentNode>(),
  },
  getters: {
    allAgentNodes: (state: any) => state.agentNodes,
  },
  mutations: {

    insertAgentNode(state: any, { agentNodes }: { agentNodes: ConsensusAgentNode | ConsensusAgentNode[] }) {

      const newAgentNodes = []
        .concat.call([], agentNodes)
        .filter((newAN: ConsensusAgentNode) => !state.agentNodes.some((storedAN: ConsensusAgentNode) => storedAN.agentId === newAN.agentId));

      state.agentNodes = [...state.agentNodes, ...newAgentNodes];

    },

    removeAgentNode(state: any, { agentNodes }: { agentNodes: ConsensusAgentNode | ConsensusAgentNode[] }) {

      const deleteAgentNodes = [].concat.call([], agentNodes);
      const result = state.agentNodes
        .filter((newAN: ConsensusAgentNode) => !deleteAgentNodes.some((storedAN: ConsensusAgentNode) => storedAN === newAN));

      state.agentNodes = [...result];

    },

  },
  actions: {
    storeAgentNode({ getters }: any) {
      const agentNodes = getters.allAgentNode;
      if (localStorage) {
        const key: string = config.app.localStoreKey;
        if (agentNodes.length > 0) {
          localStorage.setItem(key, JSON.stringify(agentNodes));
        } else {
          localStorage.removeItem(key);
        }
      }
    },
    retrieveAgentNode({ commit }: any) {
      const key: string = config.app.localStoreKey;
      const agentNodes: string | null = localStorage ? localStorage.getItem(key) : null;
      if (agentNodes) {
        commit('insertAgentNode', { agentNodes: JSON.parse(agentNodes) });
      }
    },
    async fetchAgentNodes({ commit }: any) {
      const response: ConsensusAgentNodeListResponse = await consensusService.getConsensusNodeList();
      commit('insertAgentNode', { agentNodes: response.consensus.agents });
    },
  },
};
