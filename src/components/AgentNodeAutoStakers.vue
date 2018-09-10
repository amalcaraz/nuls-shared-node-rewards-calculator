<template>
  <div class="agent-node-stakers">
    <v-data-table
      :headers="headers"
      :items="nodeStakers"
      item-key="address"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.address }}</td>
        <td class="text-xs-right digit">{{ props.item.stakingRewards | nulsCurrency }} <i class="nuls"></i></td>
        <td class="text-xs-right digit success--text">
          <strong>{{ props.item.totalRewards | nulsCurrency(8) }} <i class="nuls"></i></strong>
        </td>
      </template>
      <template slot="no-data">
        <td class="text-xs-center" colspan="100%">No stakers found!</td>
      </template>
      <template slot="footer">
        <td class="text-xs-right" colspan="2">Total rewards:</td>
        <td class="text-xs-right digit success--text" colspan="1">
          <strong>{{ totalRewards2 | nulsCurrency(8) }} <i class="nuls"></i></strong>

          <strong>{{ totalRewards | nulsCurrency(8) }} <i class="nuls"></i></strong>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { NodeAutoStaker } from '../model/stakers';
import { NodeRewards } from '../model/rewards';
import { balanceNumber } from '@/model/common';

@Component({})
export default class AgentNodeStakers extends Vue {
  @Prop() public nodeStakers!: NodeAutoStaker[];

  public stakerFormOpen: boolean = false;
  public selectedStaker: NodeAutoStaker | null = null;

  public headers: any[] = [
    { text: 'Address', value: 'address', sortable: true, align: 'left' },
    { text: 'Staking rewards', value: 'stakingRewards', sortable: true, align: 'right' },
    { text: 'Rewards', value: 'totalRewards', sortable: true, align: 'right' },
  ];

  get totalRewards(): balanceNumber {
    return this.nodeStakers ? this.nodeStakers.reduce((prev: balanceNumber, curr: NodeAutoStaker) => prev + curr.totalRewards, 0) : 0;
  }

  get totalRewards2(): balanceNumber {
    return this.nodeStakers ? this.nodeStakers.reduce((prev: balanceNumber, curr: NodeAutoStaker) => prev + curr.stakingRewards, 0) : 0;
  }

}
</script>

<style lang="scss" scoped>
.agent-node-stakers {
  position: relative;

  .digit {
    white-space: nowrap;
  }
}
</style>
