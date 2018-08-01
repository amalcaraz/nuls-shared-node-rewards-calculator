import { ConsensusAgentNodeStatus, ConsensusAgentNodeCredit, ConsensusAgentNode, agentNodeId } from './../model/consensus';
import Vue from 'vue';

const nulsDecimals: number = 8;

Vue.filter('agentNodeStatus', (value: ConsensusAgentNodeStatus, credit: number = 0) => {

  switch (value) {
    case ConsensusAgentNodeStatus.running:
      return 'Online' + (credit > ConsensusAgentNodeCredit.max ? ' (stable)' : '');
    case ConsensusAgentNodeStatus.waiting:
      return 'Waiting';
    default:
      return '';
  }

});

Vue.filter('nulsCurrency', (value: number, fixed: number = 2) => {

  const res: number = value / Math.pow(10, nulsDecimals);
  const fixedBase: number = Math.pow(10, fixed);
  return (Math.round(res * fixedBase) / fixedBase).toFixed(fixed);

});
