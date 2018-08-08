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
            <v-date-picker :value="startDate" @input="onStartDateChanged($event)"></v-date-picker>
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
            <v-date-picker :value="endDate" @input="onEndDateChanged($event)"></v-date-picker>
          </v-menu>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <strong>Total rewards:</strong>
        </v-flex>
        <v-flex xs6>
          <div class="grey--text">{{nodeRewards.totalRewards | nulsCurrency}} <i class="nuls light"></i></div>          
          <div>{{nodeRewards.nodes}}</div>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { NodeRewards } from '../model/rewards';

@Component({})
export default class AngetNodeRewards extends Vue {
  @Prop() public nodeRewards!: NodeRewards;

  public startDateMenu: any = null;
  public endDateMenu: any = null;

  get startDate(): string {
    return this.nodeRewards.paymentDateRange.startDate.format('YYYY-MM-DD');
  }

  get endDate(): string {
    return this.nodeRewards.paymentDateRange.endDate.format('YYYY-MM-DD');
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
