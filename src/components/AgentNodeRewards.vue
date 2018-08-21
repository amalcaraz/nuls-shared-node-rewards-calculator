<template>
  <v-card elevation-1 class="agent-node-rewards">
    <v-card-text>
      <v-layout>
        <v-flex xs5>
          <v-menu
            ref="startDateMenu"
            :close-on-content-click="false"
            v-model="startDateMenu"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <!-- <div slot="activator"><v-icon color="grey" small>event</v-icon> {{date}}</div> -->
            <v-text-field
              class="ma-0"
              slot="activator"
              :value="startDate"
              label=""
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker :value="startDate" @input="onStartDateChanged($event)" color="primary"></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs2 justify-center d-flex>
          <v-icon>arrow_right_alt</v-icon>
        </v-flex>
        <v-flex xs5>
          <v-menu
            ref="endDateMenu"
            :close-on-content-click="false"
            v-model="endDateMenu"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <!-- <div slot="activator"><v-icon color="grey" small>event</v-icon> {{date}}</div> -->
            <v-text-field
              class="ma-0"
              slot="activator"
              :value="endDate"
              label=""
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker :value="endDate" @input="onEndDateChanged($event)" color="primary"></v-date-picker>
          </v-menu>
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
                  <div class="error--text server-costs">
                    <strong class="editable" @click="openServerCostsForm">{{nodeRewards.serverCosts.nulsPrice | nulsCurrency}} <i class="nuls"></i></strong>
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
    <agent-node-server-costs-form :open.sync="serverCostsFormOpen"
                                :serverCosts="nodeRewards.serverCosts"
                                @serverCosts="onServerCosts"></agent-node-server-costs-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { NodeRewards } from '../model/rewards';
import AgentNodeServerCostsForm from './AgentNodeServerCostsForm.vue';
import { balanceNumber } from '@/model/common';
import { ServerCostsPrice } from '@/model/price';

@Component({
  components: {
    AgentNodeServerCostsForm,
  },
})
export default class AngetNodeRewards extends Vue {
  @Prop() public nodeRewards!: NodeRewards;

  public startDateMenu: any = null;
  public endDateMenu: any = null;
  public serverCostsFormOpen: boolean = false;

  get startDate(): string {
    return this.nodeRewards.paymentDateRange.startDate.format('YYYY-MM-DD');
  }

  get endDate(): string {
    return this.nodeRewards.paymentDateRange.endDate.format('YYYY-MM-DD');
  }

  public openServerCostsForm() {
    this.serverCostsFormOpen = true;
  }

  public onServerCosts(price: ServerCostsPrice) {
    this.$emit('serverCostsChanged', price);
  }

  public onStartDateChanged(value: string) {
    (this.$refs.startDateMenu as any).save(value);
    this.$emit('startDateChanged', value);
  }

   public onEndDateChanged(value: string) {
    (this.$refs.endDateMenu as any).save(value);
    this.$emit('endDateChanged', value);
  }
}
</script>

<style lang="scss" scoped>
.agent-node-rewards {
}
</style>
