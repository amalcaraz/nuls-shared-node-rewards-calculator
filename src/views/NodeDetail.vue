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
            ></agent-node-rewards>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <section>
      <h2 class="title">Stakers</h2>
      <agent-node-auto-stakers v-if="currentNodeConfig.configType === ConfigType.AutoStaking"
                          :nodeStakers="currentNodeStakers"
                          @newStaker="onNewStaker"
                          @updateStaker="onUpdateStaker"
                          @deleteStaker="onDeleteStaker"                          
      ></agent-node-auto-stakers>
      <agent-node-stakers v-else 
                          :nodeStakers="currentNodeStakers"
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
import { ConfigNode, ConfigServerCosts, ConfigType } from '@/model/config';
import AgentNode from '@/components/AgentNode.vue';
import AgentNodeRewards from '@/components/AgentNodeRewards.vue';
import AgentNodeStakers from '@/components/AgentNodeStakers.vue';
import AgentNodeAutoStakers from '@/components/AgentNodeAutoStakers.vue';
import * as walletService from '../services/wallet';
import { NodeRewards, NodeRewardsFilters } from '@/model/rewards';
import { Transaction } from '@/model/transactions';
import moment, { Moment } from 'moment';
import { BlocksFilters } from '@/model/blocks';
import { balanceNumber, address } from '@/model/common';
import { ServerCostsPrice } from '@/model/price';
import { setTimeout } from 'timers';
import { NodeStaker, NodeFixedStaker, NodeAutoStaker } from '@/model/stakers';

@Component({
  components: {
    AgentNode,
    AgentNodeRewards,
    AgentNodeStakers,
    AgentNodeAutoStakers,
  },
})
export default class SelectNodeView extends Vue {

  public startDate: Moment | null = null;
  public endDate: Moment | null = null;
  public ConfigType: any = ConfigType;

  get currentAgentNode(): ConsensusAgentNode {
    return this.$store.getters['consensus/agentNodeByHash'](
      this.$route.params.hash,
    );
  }

  get currentNodeConfig(): ConfigNode {
    return this.$store.getters['config/nodeConfig'](
      this.currentAgentNode.agentId,
    );
  }

  get currentDateRange(): any {
    return {
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }

  get currentNodeRewards(): NodeRewards {

    const walletDetail: WalletDetail = this.$store.getters['wallet/walletByAddress'](
      this.currentAgentNode.rewardAddress,
    );

    const dateRange = this.currentDateRange;


    // SERVER COSTS
    let serverCostsNulsPriceTotal: balanceNumber = 0;
    let serverCostsModel: ServerCostsPrice | undefined;

    if (this.currentNodeConfig.serverCosts) {

      const serverCostsPrice: ServerCostsPrice = this.$store.getters['rewards/nodeServerCosts'](
        this.currentAgentNode,
      );

      serverCostsNulsPriceTotal  = serverCostsPrice.nulsPrice;
      serverCostsModel = serverCostsPrice;

    }


    // OWNER STAKING
    let nodeStakingRewardsTotal: balanceNumber = 0;
    let nodeStakingRewardsModel: balanceNumber | undefined;

    if (this.currentNodeConfig.ownerStaking) {

      const nodeStakingRewards: balanceNumber = this.$store.getters['rewards/nodeStakingRewardsByDateRange'](
        this.currentAgentNode,
        dateRange.startDate.valueOf(),
        dateRange.endDate.valueOf(),
      );

      nodeStakingRewardsTotal = nodeStakingRewards;
      nodeStakingRewardsModel = nodeStakingRewards;

    }

    // NODE REWARDS
    if (this.currentNodeConfig.configType === ConfigType.AutoStaking) {

      const stakersAutoRewards: Record<address, balanceNumber> = this.currentStakersAutoRewards;

      return {
        nodeBalance: walletDetail.unspent_info.available_value,
        totalRewards: stakersAutoRewards[this.currentAgentNode.rewardAddress],
        paymentDateRange: dateRange,
        stakingRewards: nodeStakingRewardsModel,
        serverCosts: serverCostsModel,
        totalToShare: (stakersAutoRewards[this.currentAgentNode.rewardAddress] - nodeStakingRewardsTotal - serverCostsNulsPriceTotal),
      };

    } else {

      const nodeRewards: balanceNumber = this.$store.getters['rewards/agentNodeRewardsByDateRange'](
        this.currentAgentNode,
        dateRange.startDate.valueOf(),
        dateRange.endDate.valueOf(),
      );

      const nodeRewardsModel: NodeRewards = {
        nodeBalance: walletDetail.unspent_info.available_value,
        totalRewards: nodeRewards,
        paymentDateRange: dateRange,
        stakingRewards: nodeStakingRewardsModel,
        serverCosts: serverCostsModel,
        totalToShare: (nodeRewards - nodeStakingRewardsTotal - serverCostsNulsPriceTotal),
      };

      return nodeRewardsModel;

    }

  }

  get currentStakersAutoRewards(): Record<address, balanceNumber> {
    const dateRange = this.currentDateRange;

    return this.$store.getters['rewards/stakersAutoRewards'](
      this.currentAgentNode,
      dateRange.startDate.valueOf(),
      dateRange.endDate.valueOf(),
    );
  }

  get currentNodeStakers(): NodeStaker[] {

    if (this.currentNodeConfig.configType === ConfigType.AutoStaking) {

      return this.currentNodeAutoStakers;

    } else {

      return this.currentNodeFixedStakers;

    }

  }

  get currentNodeFixedStakers(): NodeStaker[] {
    const fixedStakers: NodeFixedStaker[] = this.$store.getters['config/stakers'](
      this.currentAgentNode.agentId,
    );

    const totalStaked: number = fixedStakers ? fixedStakers.reduce((prev: balanceNumber, curr: NodeFixedStaker) => prev + curr.staked, 0) : 0;

    return fixedStakers
      ? fixedStakers.map((staker: NodeFixedStaker) => {
        staker.totalRewards = (staker.staked / totalStaked) * this.currentNodeRewards.totalToShare;
        return staker;
      })
      : [];

  }

  get currentNodeAutoStakers(): NodeStaker[] {
    const stakersAutoRewards: Record<address, balanceNumber> = this.currentStakersAutoRewards;

    const stakers: NodeAutoStaker[] = Object
    .keys(stakersAutoRewards)
    .filter((staker: address) => staker !== this.currentAgentNode.rewardAddress)
    .map((staker: address) => {
      const commision: number = (1 - this.currentAgentNode.commissionRate / 100);
      return {
        address: staker,
        stakingRewards: stakersAutoRewards[staker],
        totalRewards: stakersAutoRewards[staker] * ((1 / commision) - 1),
      } as NodeAutoStaker;
    });

    return stakers;
  }

  public async created() {
    this.initNodeConfig();
    this.fetchRewards();
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
    const nodeConfig: ConfigNode = this.currentNodeConfig;

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

    if (this.currentNodeConfig.configType === ConfigType.AutoStaking) {

      this.fetchStakersAutoRewards();

    } else {

      this.fetchNodeRewards();

    }

    this.$store.dispatch('rewards/fetchNodeStakingRewards', {
      node: this.currentAgentNode,
      startDate: this.currentDateRange.startDate.valueOf(),
      endDate: this.currentDateRange.endDate.valueOf(),
    });

  }

  private fetchNodeRewards() {
    this.$store.dispatch('rewards/fetchNodeRewards', {
      node: this.currentAgentNode,
      startDate: this.currentDateRange.startDate.valueOf(),
      endDate: this.currentDateRange.endDate.valueOf(),
    });
  }

  private fetchStakersAutoRewards() {
    this.$store.dispatch('rewards/fetchStakersAutoRewards', {
      node: this.currentAgentNode,
      startDate: this.currentDateRange.startDate.valueOf(),
      endDate: this.currentDateRange.endDate.valueOf(),
    });
  }
}
</script>
