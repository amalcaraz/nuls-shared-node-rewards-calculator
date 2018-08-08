import config from 'config';
import { ConfigNode, Config } from '@/model/config';
import { agentNodeId } from '@/model/common';

export default {
  namespaced: true,
  state: {
    config: {
      nodes: new Array<ConfigNode>(),
    } as Config,
  },
  getters: {
    allNodes: (state: any) => state.config.nodes,
    nodeConfig: (state: any) => (id: agentNodeId) => state.config.nodes.find((node: ConfigNode) => node.agentNodeId === id),
  },
  mutations: {
    addNode(state: any, nodes: ConfigNode | ConfigNode[]) {

      const newAgentNodes = []
        .concat.call([], nodes)
        .filter((newNode: ConfigNode) => !state.config.nodes.some((storedNode: ConfigNode) => storedNode.agentNodeId === newNode.agentNodeId));

      state.config.nodes = [...state.config.nodes, ...newAgentNodes];

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
