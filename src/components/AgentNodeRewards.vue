<template>
  <v-card elevation-1 class="agent-node-rewards">
    <v-card-text>
      <v-layout>
        <v-flex xs5>
          <date-time-picker-menu-field :value="startDate"
                                       label="Start Date"
                                       @input="onStartDateChanged($event)"></date-time-picker-menu-field>
        </v-flex>
        <v-flex xs2 justify-center d-flex>
          <v-icon>arrow_right_alt</v-icon>
        </v-flex>
        <v-flex xs5>
          <date-time-picker-menu-field :value="endDate" 
                                       label="End Date"
                                       @input="onEndDateChanged($event)"></date-time-picker-menu-field>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs12 class="pt-0">
          <v-layout align-end>
            <v-flex shrink class="py-0"><div>Node balance:</div></v-flex>
            <v-flex grow class="text-xs-right py-0">
              <div class="grey--text"><strong>{{nodeRewards.nodeBalance | nulsCurrency(8)}} <i class="nuls"></i></strong></div>
            </v-flex>
          </v-layout>
          <v-layout align-end>
            <v-flex shrink class="py-0"><div>Total rewards:</div></v-flex>
            <v-flex grow class="text-xs-right py-0">
              <div class="secondary--text"><strong>{{nodeRewards.totalRewards | nulsCurrency(8)}} <i class="nuls"></i></strong></div>
            </v-flex>
          </v-layout>
          <v-layout align-end v-if="nodeRewards.stakingRewards >= 0">
            <v-flex shrink class="py-0"><div>Owner staking rewards:</div></v-flex>
            <v-flex grow class="text-xs-right py-0">
              <div class="secondary--text"><strong>{{nodeRewards.stakingRewards | nulsCurrency(8)}} <i class="nuls"></i></strong></div>
            </v-flex>
          </v-layout>
          <v-layout align-end v-if="nodeRewards.serverCosts">
            <v-flex shrink class="py-0"><div>Server maintenance costs:</div></v-flex>
            <v-flex grow class="text-xs-right py-0">
              <div class="error--text"><strong>{{nodeRewards.serverCosts.nulsPrice | nulsCurrency(8)}} <i class="nuls"></i></strong></div>
            </v-flex>
          </v-layout>
          <v-layout align-end>
            <v-flex shrink class="py-0"><div>Total rewards to share:</div></v-flex>
            <v-flex grow class="text-xs-right py-0">
              <div class="primary--text"><strong>{{nodeRewards.totalToShare | nulsCurrency(8)}} <i class="nuls"></i></strong></div>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>      
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { NodeRewards } from '../model/rewards';
import DateTimePickerDialogField from './DateTimePickerDialogField.vue';
import DateTimePickerMenuField from './DateTimePickerMenuField.vue';

import { balanceNumber } from '@/model/common';
import { ServerCostsPrice } from '@/model/price';

@Component({
  components: {
    DateTimePickerDialogField,
    DateTimePickerMenuField,
  },
})
export default class AngetNodeRewards extends Vue {
  @Prop() public nodeRewards!: NodeRewards;

  get startDate(): string {
    return this.nodeRewards.paymentDateRange.startDate.format('YYYY-MM-DD HH:mm');
  }

  get endDate(): string {
    return this.nodeRewards.paymentDateRange.endDate.format('YYYY-MM-DD HH:mm');
  }

  public onStartDateChanged(value: string) {
    this.$emit('startDateChanged', value);
  }

   public onEndDateChanged(value: string) {
    this.$emit('endDateChanged', value);
  }
}
</script>

<style lang="scss" scoped>
.agent-node-rewards {
}
</style>
