import { ConsensusSummary } from './../../model/consensus';
import config from 'config';
import * as consensusService from '../../services/consensus';
import { ConsensusAgentNode, agentHash } from '@/model/consensus';

export default {
  namespaced: true,
  state: {
    summary: {},
    agentNodes: new Array<ConsensusAgentNode>(),
  },
  getters: {
    summary: (state: any) => state.summary,
    allAgentNodes: (state: any) => state.agentNodes,
    agentNodeByHash: (state: any) => (nodeHash: agentHash) => state.agentNodes.find((agentNode: ConsensusAgentNode) => agentNode.agentHash === nodeHash),
  },
  mutations: {

    updateSummary(state: any, { summary }: { summary: ConsensusSummary }) {

      state.summary = { ...summary };

    },

    insertAgentNode(state: any, { agentNodes }: { agentNodes: ConsensusAgentNode | ConsensusAgentNode[] }) {

      if (!Array.isArray(agentNodes)) {
        agentNodes = [agentNodes];
      }

      const newAgentNodes = agentNodes
        .filter((newAN: ConsensusAgentNode) => !state.agentNodes.some((storedAN: ConsensusAgentNode) => storedAN.agentId === newAN.agentId));

      state.agentNodes = [...state.agentNodes, ...newAgentNodes];

    },

    updateAgentNode(state: any, { agentNodes }: { agentNodes: ConsensusAgentNode | ConsensusAgentNode[] }) {

      if (!Array.isArray(agentNodes)) {
        agentNodes = [agentNodes];
      }

      const notUpdatedAgentNodes = state.agentNodes
        .filter((storedAN: ConsensusAgentNode) => !(agentNodes as any[]).some((newAN: ConsensusAgentNode) => newAN.agentId === storedAN.agentId));

      state.agentNodes = [...notUpdatedAgentNodes, ...agentNodes];

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
    async fetchSummary({ commit }: any) {
      const response: ConsensusSummary = await consensusService.getConsensusSummary();
      commit('updateSummary', { summary: response });
    },
    async fetchAgentNodes({ commit }: any) {
      const response: ConsensusAgentNode[] = await consensusService.getConsensusNodeList();
      commit('updateAgentNode', { agentNodes: response });
    },
    async fetchAgentNodeDetail({ commit, dispatch }: any, nodeHash: agentHash) {
      const response: ConsensusAgentNode | undefined = await consensusService.getConsensusNodeDetail(nodeHash);
      if (response) {
        await dispatch('wallet/fetchWalletDetail', response.rewardAddress, { root: true});
        commit('insertAgentNode', { agentNodes: response });
      }
    },
  },
};
