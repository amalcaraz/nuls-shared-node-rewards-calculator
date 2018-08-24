<template>
  <v-menu
    ref="dateTimePickerMenu"
    :close-on-content-click="false"
    v-model="dateTimePickerMenu"
    :nudge-right="30"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    :max-width="width"
  >
    <v-text-field
      slot="activator"
      :value="value"
      :label="label"
      prepend-icon="event"
      readonly
    ></v-text-field>
    <date-time-picker :value="value"
                      :width="width"
                      @input="onInput"
                      @cancel="onCancel"></date-time-picker>
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import DateTimePicker from './DateTimePicker.vue';

@Component({
  components: {
    DateTimePicker,
  },
})
export default class DateTimePickerDialogField extends Vue {
  @Prop({default: ''}) public label!: string;
  @Prop({default: null}) public value!: string;
  @Prop({default: 320}) public width!: number;

  public dateTimePickerMenu: any = null;

  public onInput(dateTime: string) {
    (this.$refs.dateTimePickerMenu as any).save(dateTime);
    this.$emit('input', dateTime);
  }

  public onCancel() {
    (this.$refs.dateTimePickerMenu as any).save(null);
    this.$emit('cancel');
  }

}
</script>
