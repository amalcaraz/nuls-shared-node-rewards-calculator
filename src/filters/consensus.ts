import { ConsensusAgentNodeStatus, ConsensusAgentNodeCredit } from './../model/consensus';
import Vue from 'vue';
import { nulsIntToDecimalsFixed } from '@/services/utils';

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

  return nulsIntToDecimalsFixed(value, fixed).toFixed(fixed);

});
