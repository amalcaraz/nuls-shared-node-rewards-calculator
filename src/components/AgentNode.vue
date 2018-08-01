<template>
  <v-card elevation-1 :ripple="{class: 'primary--text'}" class="agent-node">
    <v-card-text>
      <v-layout>
        <v-flex xs6>
          <strong>{{agentNode.agentId}}</strong>
          <div class="agent-node-name primary--text">{{agentNode.agentName ? agentNode.agentName : agentNode.agentAddress}}</div>
          <div class="grey--text">{{agentNode.commissionRate}}%</div>
        </v-flex>
        <v-flex xs6>
          <div><agent-node-status :status="agentNode.status" :credit="agentNode.creditVal"></agent-node-status></div>
          <div class="grey--text"><v-icon color="grey" small>person</v-icon> {{agentNode.memberCount}}</div>
          <div class="grey--text"><v-icon color="grey" small>account_balance_wallet</v-icon> {{agentNode.deposit | nulsCurrency}}</div>
          <div class="grey--text"><v-icon color="grey" small>attach_money</v-icon> {{agentNode.totalDeposit | nulsCurrency}}</div>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs12>
          <agent-node-credit :credit="agentNode.creditVal"></agent-node-credit>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ConsensusAgentNode } from '../model/consensus';
import AgentNodeStatus from '@/components/AgentNodeStatus.vue';
import AgentNodeCredit from '@/components/AgentNodeCredit.vue';

@Component({
  components: {
    AgentNodeStatus,
    AgentNodeCredit,
  },
})
export default class AgentNode extends Vue {
  @Prop() public agentNode!: ConsensusAgentNode;
}
</script>

<style lang="scss" scoped>
.agent-node-name {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
