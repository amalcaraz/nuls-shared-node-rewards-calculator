<template>
  <v-card :width="width">
    <v-card-text class="pa-0">
      <v-tabs fixed-tabs v-model="activeTab" slider-color="primary">
        <v-tab key="date-tab">
          <v-icon>event</v-icon>
        </v-tab>
        <v-tab key="time-tab" :disabled="!dateSelected">
          <v-icon>access_time</v-icon>
        </v-tab>
        <v-tab-item key="date-tab">
          <v-date-picker
                  full-width
                  color="primary"
                  header-color="grey-1"
                  v-model="datePart"
                  scrollable
                  :locale="locale"
                  actions>
          </v-date-picker>
        </v-tab-item>
        <v-tab-item key="time-tab">
          <v-time-picker
                  ref="timePicker"
                  full-width
                  color="primary"
                  header-color="grey-1"
                  class="v-time-picker-custom"
                  v-model="timePart"
                  scrollable
                  :format="timePickerFormat"
                  actions>
          </v-time-picker>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="error" flat @click.native="onCancel">Cancel</v-btn>
      <v-btn color="primary" flat @click="onSubmit">Ok</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ConsensusAgentNodeStatus, ConsensusAgentNodeCredit } from '../model/consensus';
import moment, { Moment } from 'moment';

const DEFAULT_DATE_FORMAT: string = 'YYYY-MM-DD';
const DEFAULT_TIME_FORMAT: string = 'HH:mm';
const DEFAULT_TIMEDATE_FORMAT: string = `${DEFAULT_DATE_FORMAT} ${DEFAULT_TIME_FORMAT}`;
const DEFAULT_TIME: string = '00:00';


@Component({})
export default class DateTimePicker extends Vue {
  @Prop({default: null}) public value!: string;
  @Prop({default: 320}) public width!: number;
  @Prop({default: DEFAULT_TIMEDATE_FORMAT}) public format!: string;
  @Prop({default: '24hr'}) public timePickerFormat!: string;
  @Prop({default: 'en-us'}) public locale!: string;

  public dateSelected: boolean = false;
  public timeSelected: boolean = false;
  public activeTab: number = 0;
  public selectedDatetime: string | null = null;

  public created() {
    this.selectedDatetime = this.value;
    if (this.selectedDatetime) {
      this.dateSelected = true;
      this.timeSelected = true;
    }
  }

  public get datePart(): string {
    return this.selectedDatetime ? moment(this.selectedDatetime).format(DEFAULT_DATE_FORMAT) : moment().format(DEFAULT_DATE_FORMAT);
  }

  public set datePart(value: string) {
    this.dateSelected = true;
    this.activeTab = 1;

    const date = moment(value, DEFAULT_DATE_FORMAT);
    const hour = this.selectedDatetime ? moment(this.selectedDatetime).hour() : 0;
    const minute = this.selectedDatetime ? moment(this.selectedDatetime).minute() : 0;
    const input = moment().year(date.year()).month(date.month()).date(date.date()).hour(hour).minute(minute).second(0);
    this.selectedDatetime = input.format(DEFAULT_TIMEDATE_FORMAT);
  }

  public get timePart(): string {
    return this.selectedDatetime ? moment(this.selectedDatetime).format(DEFAULT_TIME_FORMAT) : DEFAULT_TIME;
  }

  public set timePart(value: string) {
    this.timeSelected = true;

    const time = moment(value, DEFAULT_TIME_FORMAT);
    const input = moment(this.selectedDatetime as string).hour(time.hour()).minute(time.minute()).second(0);
    this.selectedDatetime = input.format(DEFAULT_TIMEDATE_FORMAT);
  }

  public onSubmit() {
    this.activeTab = 0;
    (this.$refs.timePicker as any).selectingHour = true;

    const output: string | null = this.selectedDatetime
      ? moment(this.selectedDatetime).format(this.format)
      : null;

    this.$emit('input', output);
  }

  public onCancel() {
    this.activeTab = 0;
    (this.$refs.timePicker as any).selectingHour = true;

    // this.$emit('input', null);
    this.$emit('cancel', null);
  }
}
</script>
