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
        <td class="text-xs-left">{{ props.item.staked | nulsCurrency}} <i class="nuls light"></i></td>
        <td class="text-xs-left">{{ props.item.alias }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ props.item.profitRate }}</td>
        <td class="text-xs-left success--text"><strong>{{ props.item.totalProfit }}</strong></td>
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
        <td class="text-xs-left" colspan="6">{{totalStaked | nulsCurrency}} <i class="nuls light"></i></td>
      </template>
    </v-data-table>
    <v-dialog v-model="stakerFormOpen" persistent max-width="500px">
      <agent-node-staker-form :staker="selectedStaker"
                              @cancel="onCancelForm"
                              @staker="onStakerReceived"></agent-node-staker-form>
    </v-dialog>
    <v-btn @click="onOpenNewStakerForm(null)" absolute dark fab bottom right color="secondary">
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { NodeStaker } from '../model/stakers';
import AgentNodeStakerForm from './AgentNodeStakerForm.vue';
import { balanceNumber } from '@/model/common';

@Component({
  components: {
    AgentNodeStakerForm,
  },
})
export default class AgentNodeStakers extends Vue {
  @Prop() public nodeStakers!: NodeStaker[];

  public stakerFormOpen: boolean = false;
  public selectedStaker: NodeStaker | null = null;

  public headers: any[] = [
    { text: 'Address', value: 'address', sortable: true, align: 'left' },
    { text: 'Staked', value: 'staked', sortable: true, align: 'left' },
    { text: 'Alias', value: 'alias', sortable: true, align: 'left' },
    { text: 'Email', value: 'email', sortable: true, align: 'left' },
    { text: 'Profit rate', value: 'profitRate', sortable: true, align: 'left' },
    { text: 'Total profit', value: 'totalProfit', sortable: true, align: 'left' },
    { text: 'Actions', value: 'actions', sortable: false, align: 'left' },
  ];

  get totalStaked(): balanceNumber {
    return this.nodeStakers ? this.nodeStakers.reduce((prev: balanceNumber, curr: NodeStaker) => prev + curr.staked, 0) : 0;
  }

  public onOpenNewStakerForm(staker: NodeStaker) {
    this.selectedStaker = staker;
    this.stakerFormOpen = true;
  }

  public onCancelForm() {
    this.selectedStaker = null;
    this.stakerFormOpen = false;
  }

  public onStakerReceived(staker: NodeStaker) {
    if (!this.selectedStaker) {
      this.$emit('newStaker', staker);
    } else {
      this.$emit('updateStaker', staker);
    }
    this.onCancelForm();
  }

  public onDeleteStaker(staker: NodeStaker) {
    this.onCancelForm();
    this.$emit('deleteStaker', staker);
  }

  public onUpdateStaker(staker: NodeStaker) {
    this.onCancelForm();
    this.$emit('deleteStaker', staker);
  }

}
</script>

<style lang="scss" scoped>
.agent-node-stakers {
  position: relative;
}
</style>