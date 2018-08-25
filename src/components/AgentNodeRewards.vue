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
          <v-layout wrap>
            <v-flex xs12 sm4 md6 lg4>
              <v-layout>
                <v-flex shrink>
                  <div>Node balance:</div>
                  <div>Total rewards:</div>
                  <div>Owner staking rewards:</div>
                </v-flex>
                <v-flex grow class="text-xs-right">
                  <div class="grey--text">
                    <strong>{{nodeRewards.nodeBalance | nulsCurrency}} <i class="nuls"></i></strong>
                  </div>
                  <div class="secondary--text">
                    <strong>{{nodeRewards.totalRewards | nulsCurrency}} <i class="nuls"></i></strong>
                  </div>
                  <div class="secondary--text">
                    <strong>{{nodeRewards.stakingRewards | nulsCurrency}} <i class="nuls"></i></strong>
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm4 md6 lg4>
              <v-layout>
                <v-flex shrink>
                  <div>Server maintenance costs:</div>
                  <div>Total rewards to share:</div>
                </v-flex>
                <v-flex grow class="text-xs-right">
                  <div class="error--text">
                    <strong>{{nodeRewards.serverCosts.nulsPrice | nulsCurrency}} <i class="nuls"></i></strong>
                  </div>
                  <div class="primary--text">
                    <strong>{{nodeRewards.totalToShare | nulsCurrency}} <i class="nuls"></i></strong>
                  </div>
                </v-flex>
              </v-layout>
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
