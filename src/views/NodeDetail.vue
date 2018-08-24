<template>
  <div>
    <section>
      <v-container class="pa-0" grid-list-lg fluid>
        <v-layout row wrap class="">
          <v-flex xs12 sm6 md4>
            <h2 class="title">Details</h2>
            <agent-node :agentNode="currentAgentNode"></agent-node>
          </v-flex>
          <v-flex xs12 sm12 md8>
            <h2 class="title">Rewards</h2>
            <agent-node-rewards :nodeRewards="currentNodeRewards"
                                @startDateChanged="onStartDateChanged"
                                @endDateChanged="onEndDateChanged"
                                @serverCostsChanged="onServerCostsChanged"
            ></agent-node-rewards>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <section>
      <h2 class="title">Stakers</h2>
      <agent-node-stakers :nodeStakers="currentNodeStakers"
                          :nodeRewards="currentNodeRewards"
                          @newStaker="onNewStaker"
                          @updateStaker="onUpdateStaker"
                          @deleteStaker="onDeleteStaker"                          
      ></agent-node-stakers>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ConsensusAgentNode, ConsensusSummary } from '../model/consensus';
import { TransactionsFilters, TransactionType } from '../model/transactions';
import { WalletDetail } from '@/model/wallet';
import { ConfigNode, ConfigServerCosts } from '@/model/config';
import AgentNode from '@/components/AgentNode.vue';
import AgentNodeRewards from '@/components/AgentNodeRewards.vue';
import AgentNodeStakers from '@/components/AgentNodeStakers.vue';
import * as walletService from '../services/wallet';
import { NodeRewards, NodeRewardsFilters } from '@/model/rewards';
import { Transaction } from '@/model/transactions';
import moment, { Moment } from 'moment';
import { BlocksFilters } from '@/model/blocks';
import { balanceNumber } from '@/model/common';
import { ServerCostsPrice } from '@/model/price';
import { setTimeout } from 'timers';
import { NodeStaker } from '@/model/stakers';

@Component({
  components: {
    AgentNode,
    AgentNodeRewards,
    AgentNodeStakers,
  },
})
export default class SelectNode extends Vue {

  public startDate: Moment | null = null;
  public endDate: Moment | null = null;

  get currentAgentNode(): ConsensusAgentNode {
    return this.$store.getters['consensus/agentNodeByHash'](
      this.$route.params.hash,
    );
  }

  get currentDateRange(): any {
    return {
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }

  get currentNodeRewards(): NodeRewards {
    const dateRange = this.currentDateRange;

    const walletDetail: WalletDetail = this.$store.getters['wallet/walletByAddress'](
      this.currentAgentNode.rewardAddress,
    );

    const nodeRewards: balanceNumber = this.$store.getters['rewards/agentNodeRewardsByDateRange'](
      this.currentAgentNode,
      this.currentDateRange.startDate.valueOf(),
      this.currentDateRange.endDate.valueOf(),
    );

    const nodeStakingRewards: balanceNumber = this.$store.getters['rewards/nodeStakingRewardsByDateRange'](
      this.currentAgentNode,
      this.currentDateRange.startDate.valueOf(),
      this.currentDateRange.endDate.valueOf(),
    );

    const serverCostsPrice: ServerCostsPrice = this.$store.getters['rewards/nodeServerCosts'](
      this.currentAgentNode,
    );

    return {
      nodeBalance: walletDetail.unspent_info.available_value,
      totalRewards: nodeRewards,
      stakingRewards: nodeStakingRewards,
      paymentDateRange: dateRange,
      serverCosts: serverCostsPrice,
      totalToShare: (nodeRewards - nodeStakingRewards - serverCostsPrice.nulsPrice),
    };
  }

  get currentNodeStakers(): NodeStaker[] {
    return this.$store.getters['config/stakers'](
      this.currentAgentNode.agentId,
    );
   }

  public async created() {
    this.initNodeConfig();
    this.fetchRewards();
    this.fetchServerCosts();
  }

  public onServerCostsChanged(price: ServerCostsPrice) {
    const serverCosts: ConfigServerCosts = {
      currency: price.currency,
      price: price.price,
    };
    this.$store.dispatch('config/updateServerCosts', { id: this.currentAgentNode.agentId , serverCosts });
    this.fetchServerCosts();
  }

  public async onStartDateChanged(startDate: string) {
    this.startDate = moment(startDate).clone();

    setTimeout(() => this.fetchRewards(), 500);

    // this.$store.dispatch('config/changePaymentDateRange', {
    //   startDate,
    //   endDate: this.nodeRewards.paymentDateRange.endDate,
    // });
  }

  public async onEndDateChanged(endDate: string) {
    this.endDate = moment(endDate).clone();

    setTimeout(() => this.fetchRewards(), 500);

    // this.$store.dispatch('config/changePaymentDateRange', {
    //   startDate: this.nodeRewards.paymentDateRange.startDate,
    //   endDate,
    // });
  }

  public onNewStaker(staker: NodeStaker) {
    this.$store.dispatch('config/addStaker', { id: this.currentAgentNode.agentId, staker });
  }

  public onUpdateStaker(staker: NodeStaker) {
    this.$store.dispatch('config/updateStaker', { id: this.currentAgentNode.agentId, staker });
  }

  public onDeleteStaker(staker: NodeStaker) {
    this.$store.dispatch('config/deleteStaker', { id: this.currentAgentNode.agentId, staker });
  }

  private initNodeConfig() {
    const nodeConfig: ConfigNode = this.$store.getters['config/nodeConfig'](
      this.currentAgentNode.agentId,
    );

    this.startDate = nodeConfig.lastPaymentDate
      ? moment(nodeConfig.lastPaymentDate).startOf('day')
      : moment().startOf('day');

    this.endDate = nodeConfig.paymentFreq
      ? this.startDate.clone().add(1, nodeConfig.paymentFreq).endOf('day')
      : this.startDate.clone().add(1, 'week').endOf('day');
  }

  private fetchServerCosts() {
    this.$store.dispatch('rewards/fetchNodeServerCosts', {
      node: this.currentAgentNode,
    });
  }

  private fetchRewards() {

    this.$store.dispatch('rewards/fetchNodeRewards', {
      node: this.currentAgentNode,
      startDate: this.currentDateRange.startDate.valueOf(),
      endDate: this.currentDateRange.endDate.valueOf(),
    });

    this.$store.dispatch('rewards/fetchNodeStakingRewards', {
      node: this.currentAgentNode,
      startDate: this.currentDateRange.startDate.valueOf(),
      endDate: this.currentDateRange.endDate.valueOf(),
    });
  }
}
</script>
