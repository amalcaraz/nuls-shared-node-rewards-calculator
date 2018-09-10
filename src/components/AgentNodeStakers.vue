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
        <td class="text-xs-right digit">{{ props.item.staked | nulsCurrency}} <i class="nuls"></i></td>
        <td class="text-xs-left">{{ props.item.alias }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-right digit success--text">
          <strong>{{ props.item.totalRewards | nulsCurrency }} <i class="nuls"></i></strong>
        </td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="onOpenNewStakerForm(props.item)">edit</v-icon>
          <v-icon small @click="onDeleteStaker(props.item)">delete</v-icon>
        </td>
      </template>
      <template slot="no-data">
        <td class="text-xs-center" colspan="100%">No stakers, add the first one!</td>
      </template>
      <template slot="footer">
        <td class="text-xs-right" colspan="1">Total staked:</td>
        <td class="text-xs-right digit" colspan="1">{{totalStaked | nulsCurrency}} <i class="nuls"></i></td>
        <td class="text-xs-right" colspan="2">Total rewards:</td>
        <td class="text-xs-right digit success--text" colspan="1">
          <strong>{{totalRewards | nulsCurrency}} <i class="nuls"></i></strong>
        </td>
        <td colspan="1"></td>
      </template>
    </v-data-table>
    <v-dialog v-model="stakerFormOpen" persistent max-width="500px">
      <agent-node-staker-form :staker="selectedStaker"
                              @cancel="onCancelForm"
                              @staker="onStakerReceived"></agent-node-staker-form>
    </v-dialog>
    <v-btn @click="onOpenNewStakerForm(null)" absolute dark fab bottom right color="primary">
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { NodeFixedStaker } from '../model/stakers';
import { NodeRewards } from '../model/rewards';
import AgentNodeStakerForm from './AgentNodeStakerForm.vue';
import { balanceNumber } from '@/model/common';

@Component({
  components: {
    AgentNodeStakerForm,
  },
})
export default class AgentNodeStakers extends Vue {
  @Prop() public nodeStakers!: NodeFixedStaker[];

  public stakerFormOpen: boolean = false;
  public selectedStaker: NodeFixedStaker | null = null;

  public headers: any[] = [
    { text: 'Address', value: 'address', sortable: true, align: 'left' },
    { text: 'Staked', value: 'staked', sortable: true, align: 'right' },
    { text: 'Alias', value: 'alias', sortable: true, align: 'left' },
    { text: 'Email', value: 'email', sortable: true, align: 'left' },
    { text: 'Rewards', value: 'totalRewards', sortable: true, align: 'right' },
    { text: 'Actions', value: 'actions', sortable: false, align: 'left' },
  ];

  get totalStaked(): number {
    return this.nodeStakers ? this.nodeStakers.reduce((prev: balanceNumber, curr: NodeFixedStaker) => prev + curr.staked, 0) : 0;
  }

  get totalRewards(): balanceNumber {
    return this.nodeStakers ? this.nodeStakers.reduce((prev: balanceNumber, curr: NodeFixedStaker) => prev + curr.totalRewards, 0) : 0;
  }

  public onOpenNewStakerForm(staker: NodeFixedStaker | null) {
    this.selectedStaker = staker;
    this.stakerFormOpen = true;
  }

  public onCancelForm() {
    this.selectedStaker = null;
    this.stakerFormOpen = false;
  }

  public onStakerReceived(staker: NodeFixedStaker) {
    if (!this.selectedStaker) {
      this.$emit('newStaker', staker);
    } else {
      this.$emit('updateStaker', staker);
    }
    this.onCancelForm();
  }

  public onDeleteStaker(staker: NodeFixedStaker) {
    this.$emit('deleteStaker', staker);
    this.onCancelForm();
  }

  public onUpdateStaker(staker: NodeFixedStaker) {
    this.$emit('deleteStaker', staker);
    this.onCancelForm();
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
