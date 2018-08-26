import { ConsensusSummary, ConsensusResponse, ConsensusListFilters } from './../../model/consensus';
import * as consensusService from '../../services/consensus';
import { ConsensusAgentNode, agentHash } from '@/model/consensus';
import { blockHeight } from '../../model/common';
import { enhancedGetters } from 'vuex-strong-cache';

// tslint:disable-next-line:max-line-length
function filterConsensusListByHeightRange(consensusList: ConsensusResponse[], startHeight: blockHeight = 0, endHeight: blockHeight = Number.MAX_SAFE_INTEGER): ConsensusResponse[] {
  return consensusList.filter((consensus: ConsensusResponse) =>
    consensus.consensus.height >= startHeight &&
    consensus.consensus.height <= endHeight,
  );
}

function filterConsensusListByFilters(txs: ConsensusResponse[], filters: ConsensusListFilters) {

  let filteredConsensusResponses: ConsensusResponse[] = txs; // txs.slice(0);

  if (filters.startHeight || filters.endHeight) {
    filteredConsensusResponses = filterConsensusListByHeightRange(filteredConsensusResponses, filters.startHeight, filters.endHeight);
  }

  return filteredConsensusResponses;
}

export default {
  namespaced: true,
  state: {
    summary: {},
    agentNodes: new Array<ConsensusAgentNode>(),
    consensusList: new Array<ConsensusResponse>(),
  },
  getters: enhancedGetters({
    summary: (state: any) => state.summary,
    allConsensusList: (state: any) => state.consensusList,
    consensusListByHeightRange: (state: any) =>
      (startHeight: blockHeight, endHeight: blockHeight) => filterConsensusListByHeightRange(state.consensusList, startHeight, endHeight),
    consensusListByFilters: (state: any) => (filters: ConsensusListFilters) => filterConsensusListByFilters(state.consensusList, filters),
    allAgentNodes: (state: any) => state.agentNodes,
    agentNodeByHash: (state: any) => (nodeHash: agentHash) => state.agentNodes.find((agentNode: ConsensusAgentNode) => agentNode.agentHash === nodeHash),
  }),
  mutations: {
    updateSummary(state: any, { summary }: { summary: ConsensusSummary }) {

      state.summary = { ...summary };

    },
    updateConsensusList(state: any, { consensusList }: { consensusList: ConsensusResponse[] }) {

      // const notUpdatedConsensusList = state.consensusList
      //   .filter((storedCL: ConsensusResponse) =>
      //     !(consensusList as any[]).some((newCL: ConsensusResponse) => newCL.consensus.height === storedCL.consensus.height));

      // state.consensusList = [...notUpdatedConsensusList, ...consensusList];

      state.consensusList = [...consensusList];

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
    async fetchSummary({ commit }: any) {
      const response: ConsensusSummary = await consensusService.getConsensusSummary();
      commit('updateSummary', { summary: response });
    },
    async fetchConsensusList({ commit }: any, filters: ConsensusListFilters) {
      const response: ConsensusResponse[] = await consensusService.getConsensusList(filters);
      commit('updateConsensusList', { consensusList: response });
    },
    async fetchAgentNodes({ commit }: any) {
      const response: ConsensusAgentNode[] = await consensusService.getConsensusNodeList();
      commit('updateAgentNode', { agentNodes: response });
    },
    async fetchAgentNodeDetail({ commit, dispatch }: any, nodeHash: agentHash) {
      const response: ConsensusAgentNode | undefined = await consensusService.getConsensusNodeDetail(nodeHash);
      if (response) {
        await dispatch('wallet/fetchWalletDetail', response.rewardAddress, { root: true });
        commit('insertAgentNode', { agentNodes: response });
      }
    },
  },
};
