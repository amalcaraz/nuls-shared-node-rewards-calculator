import config from 'config';
import { ConfigNode, Config } from '@/model/config';
import { agentNodeId } from '@/model/common';
import { ConfigStaker, ConfigServerCosts } from '../../model/config';
import Vue from 'vue';


function findNodeConfigById(nodes: ConfigNode[], id: agentNodeId): ConfigNode | undefined {
  return nodes.find((node: ConfigNode) => node.agentNodeId === id);
}

function findNodeServerCostsById(nodes: ConfigNode[], id: agentNodeId): ConfigServerCosts | undefined {
  const node: ConfigNode | undefined = findNodeConfigById(nodes, id);
  return node
    ? node.serverCosts
    : undefined;
}

function findNodeStakersById(nodes: ConfigNode[], id: agentNodeId): ConfigStaker[] {
  const node: ConfigNode | undefined = findNodeConfigById(nodes, id);
  return node
    ? node.stakers
    : [];
}

export default {
  namespaced: true,
  state: {
    config: {
      nodes: new Array<ConfigNode>(),
    } as Config,
  },
  getters: {
    allNodes: (state: any) => state.config.nodes,
    serverCosts: (state: any) => (id: agentNodeId) => findNodeServerCostsById(state.config.nodes, id),
    stakers: (state: any) => (id: agentNodeId) => findNodeStakersById(state.config.nodes, id),
    nodeConfig: (state: any) => (id: agentNodeId) => findNodeConfigById(state.config.nodes, id),
  },
  mutations: {
    updateServerCosts(state: any, { id, serverCosts }: { id: agentNodeId, serverCosts: ConfigServerCosts }) {
      const node: ConfigNode | undefined = findNodeConfigById(state.config.nodes, id);
      if (node) {
        node.serverCosts = serverCosts;
      }
    },
    addNode(state: any, nodes: ConfigNode | ConfigNode[]) {
      const newAgentNodes = []
        .concat.call([], nodes)
        .filter((newNode: ConfigNode) => !state.config.nodes.some((storedNode: ConfigNode) => storedNode.agentNodeId === newNode.agentNodeId));

      state.config.nodes = [...state.config.nodes, ...newAgentNodes];
    },
    addStaker(state: any, { id, staker }: { id: agentNodeId, staker: ConfigStaker }) {
      const node: ConfigNode | undefined = findNodeConfigById(state.config.nodes, id);
      if (node) {
        if (!Array.isArray(node.stakers)) {
          node.stakers = [];
        }
        node.stakers.push(staker);
      }
    },
    updateStaker(state: any, { id, staker }: { id: agentNodeId, staker: ConfigStaker }) {
      const node: ConfigNode | undefined = findNodeConfigById(state.config.nodes, id);
      if (node) {
        const index: number = node.stakers.findIndex((storedStaker: ConfigStaker) => storedStaker.address === staker.address);
        Vue.set(node.stakers, index, staker);
      }
    },
    deleteStaker(state: any, { id, staker }: { id: agentNodeId, staker: ConfigStaker }) {
      const node: ConfigNode | undefined = findNodeConfigById(state.config.nodes, id);
      if (node) {
        const index: number = node.stakers.indexOf(staker);
        node.stakers.splice(index, 1);
      }
    },
    loadState(state: any, newConfig: any) {
      state.config = { ...newConfig };
    },
  },
  actions: {
    addNode({ commit, dispatch }: any, node: ConfigNode | ConfigNode[]) {
      commit('addNode', node);
      dispatch('storeConfig');
    },
    updateServerCosts({ commit, dispatch }: any, payload: { id: agentNodeId, serverCosts: ConfigServerCosts }) {
      commit('updateServerCosts', payload);
      dispatch('storeConfig');
    },
    addStaker({ commit, dispatch }: any, payload: { id: agentNodeId, staker: ConfigStaker }) {
      commit('addStaker', payload);
      dispatch('storeConfig');
    },
    updateStaker({ commit, dispatch }: any, payload: { id: agentNodeId, staker: ConfigStaker }) {
      commit('updateStaker', payload);
      dispatch('storeConfig');
    },
    deleteStaker({ commit, dispatch }: any, payload: { id: agentNodeId, staker: ConfigStaker }) {
      commit('deleteStaker', payload);
      dispatch('storeConfig');
    },
    storeConfig({ state }: any) {
      if (localStorage) {
        const key: string = config.app.localStoreKey;
        state
          ? localStorage.setItem(key, JSON.stringify(state.config))
          : localStorage.removeItem(key);
      }
    },
    retrieveConfig({ commit }: any) {
      if (localStorage) {
        const key: string = config.app.localStoreKey;
        const loadedConfig: string | null = localStorage.getItem(key);
        if (loadedConfig) {
          commit('loadState', JSON.parse(loadedConfig));
        }
      }
    },
  },
};
