<template>
  <div>
    <section>
      <v-container class="pa-0" grid-list-lg fluid>
        <v-layout row wrap>
          <v-flex xs12 sm6 class="py-0">
            <h2 class="title">Details</h2>
          </v-flex>
          <v-flex xs12 sm6 class="py-0">
            <h2 class="title">Rewards</h2>
          </v-flex>
        </v-layout>
        <v-layout row wrap class="full-height">
          <v-flex xs12 sm6>
            <agent-node :agentNode="currentAgentNode"></agent-node>
          </v-flex>
          <v-flex xs12 sm6>
            <agent-node-rewards :nodeRewards="nodeRewards"
                                @startDateChanged="onStartDateChanged"
                                @endDateChanged="onEndDateChanged"
            ></agent-node-rewards>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <section>
      <h2 class="title">Partners</h2>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ConsensusAgentNode, ConsensusSummary } from '../model/consensus';
import { WalletDetail } from '@/model/wallet';
import { ConfigNode } from '@/model/config';
import AgentNode from '@/components/AgentNode.vue';
import AgentNodeRewards from '@/components/AgentNodeRewards.vue';
import { mapGetters } from 'vuex';
import * as walletService from '../services/wallet';
import { NodeRewards } from '@/model/rewards';
import moment, { Moment } from 'moment';

@Component({
  components: {
    AgentNode,
    AgentNodeRewards,
  },
  computed: {
    ...mapGetters('config', ['nodeConfig']),
    ...mapGetters('consensus', ['agentNodeByHash']),
    ...mapGetters('wallet', ['walletByAddress']),
  },
})
export default class SelectNode extends Vue {
  public nodeRewards: NodeRewards = {} as any;

  // TODO: find a better way to type mapGetters props
  public nodeConfig: any;
  public agentNodeByHash: any;
  public walletByAddress: any;

  get currentAgentNode(): ConsensusAgentNode {
    return this.agentNodeByHash(this.$route.params.hash);
  }

  get currentAgentNodeConfig(): ConfigNode {
    return this.nodeConfig(this.currentAgentNode.agentId);
  }

  get currentWallet(): WalletDetail {
    return this.walletByAddress(this.currentAgentNode.rewardAddress);
  }

  public created() {
    this.nodeRewards = this.getNodeRewards();
  }

  public onStartDateChanged(startDate: string) {
    this.nodeRewards.paymentDateRange = {
      startDate: moment(startDate).startOf('day'),
      endDate: this.nodeRewards.paymentDateRange.endDate,
    };

    // this.$store.dispatch('config/changePaymentDateRange', {
    //   startDate,
    //   endDate: this.nodeRewards.paymentDateRange.endDate,
    // });
  }

  public onEndDateChanged(endDate: string) {
    this.nodeRewards.paymentDateRange = {
      startDate: this.nodeRewards.paymentDateRange.startDate,
      endDate: moment(endDate).startOf('day'),
    };
    // this.$store.dispatch('config/changePaymentDateRange', {
    //   startDate: this.nodeRewards.paymentDateRange.startDate,
    //   endDate,
    // });
  }

  private getNodeRewards(): NodeRewards {

    const walletDetail: WalletDetail = this.currentWallet;
    const nodeConfig: ConfigNode = this.currentAgentNodeConfig;

    const startDate: Moment = nodeConfig.lastPaymentDate ? moment(nodeConfig.lastPaymentDate).startOf('day') : moment().startOf('day');
    const endDate: Moment = nodeConfig.paymentFreq ? startDate.clone().add(1, nodeConfig.paymentFreq) : startDate.clone().add(1, 'week');

    return {
      totalRewards: walletDetail.unspent_info.available_value,
      paymentDateRange: {
        startDate,
        endDate,
      },
    };

  }

}
</script>