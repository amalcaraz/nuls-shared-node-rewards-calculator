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
            <agent-node-rewards :nodeRewards="currentNodeRewards"
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
import { TransactionsFilters, TransactionType } from '../model/transactions';
import { WalletDetail } from '@/model/wallet';
import { ConfigNode } from '@/model/config';
import AgentNode from '@/components/AgentNode.vue';
import AgentNodeRewards from '@/components/AgentNodeRewards.vue';
import * as walletService from '../services/wallet';
import { NodeRewards, NodeRewardsFilters } from '@/model/rewards';
import { Transaction } from '@/model/transactions';
import moment, { Moment } from 'moment';
import { BlocksFilters } from '@/model/blocks';

@Component({
  components: {
    AgentNode,
    AgentNodeRewards,
  },
})
export default class SelectNode extends Vue {
  // public nodeRewards: NodeRewards = {} as any;
  public startDate: Moment | null = null;
  public endDate: Moment | null = null;

  get currentAgentNode(): ConsensusAgentNode {
    return this.$store.getters['consensus/agentNodeByHash'](
      this.$route.params.hash,
    );
  }

  get currentAgentNodeConfig(): ConfigNode {
    return this.$store.getters['config/nodeConfig'](
      this.currentAgentNode.agentId,
    );
  }

  get currentWallet(): WalletDetail {
    return this.$store.getters['wallet/walletByAddress'](
      this.currentAgentNode.rewardAddress,
    );
  }

  get currentDateRange(): any {
    return {
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }

  get currentAgentNodeRewardsByDateRange(): number {
    return this.$store.getters['rewards/agentNodeRewardsByDateRange'](
      this.currentAgentNode,
      this.currentDateRange.startDate.valueOf(),
      this.currentDateRange.endDate.valueOf(),
    );
  }

  get currentNodeStakingRewardsByDateRange(): number {
    return this.$store.getters['rewards/nodeStakingRewardsByDateRange'](
      this.currentAgentNode,
      this.currentDateRange.startDate.valueOf(),
      this.currentDateRange.endDate.valueOf(),
    );
  }

  get currentNodeRewards(): NodeRewards {
    const walletDetail: WalletDetail = this.currentWallet;
    const dateRange = this.currentDateRange;
    const nodeRewards = this.currentAgentNodeRewardsByDateRange;
    const nodeStakingRewards = this.currentNodeStakingRewardsByDateRange;

    return {
      nodeBalance: walletDetail.unspent_info.available_value,
      totalRewards: nodeRewards,
      stakingRewards: nodeStakingRewards,
      paymentDateRange: dateRange,
    };
  }

  public created() {
    this.initDateRange();
    this.fetchRewards();
  }

  public onStartDateChanged(startDate: string) {
    this.startDate = moment(startDate)
      .clone()
      .startOf('day');

    this.fetchRewards();

    // this.$store.dispatch('config/changePaymentDateRange', {
    //   startDate,
    //   endDate: this.nodeRewards.paymentDateRange.endDate,
    // });
  }

  public onEndDateChanged(endDate: string) {
    this.endDate = moment(endDate)
      .clone()
      .endOf('day');

    this.fetchRewards();

    // this.$store.dispatch('config/changePaymentDateRange', {
    //   startDate: this.nodeRewards.paymentDateRange.startDate,
    //   endDate,
    // });
  }

  private initDateRange() {
    const nodeConfig: ConfigNode = this.currentAgentNodeConfig;

    this.startDate = nodeConfig.lastPaymentDate
      ? moment(nodeConfig.lastPaymentDate).startOf('day')
      : moment().startOf('day');

    this.endDate = nodeConfig.paymentFreq
      ? this.startDate.clone().add(1, nodeConfig.paymentFreq).endOf('day')
      : this.startDate.clone().add(1, 'week').endOf('day');
  }

  private fetchRewards() {
    this.$store.dispatch('rewards/fetchNodeRewards', {
      node: this.currentAgentNode,
      startDate: this.currentNodeRewards.paymentDateRange.startDate.valueOf(),
      endDate: this.currentNodeRewards.paymentDateRange.endDate.valueOf(),
    });

    this.$store.dispatch('rewards/fetchNodeStakingRewards', {
      node: this.currentAgentNode,
      startDate: this.currentNodeRewards.paymentDateRange.startDate.valueOf(),
      endDate: this.currentNodeRewards.paymentDateRange.endDate.valueOf(),
    });
  }
}
</script>
