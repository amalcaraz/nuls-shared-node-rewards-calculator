<template>
    <v-dialog
            v-model="display"
            persistent
            lazy
            full-width
            :width="width">
        <v-text-field
                slot="activator"
                :label="label"
                :value="value"
                readonly>
        </v-text-field>
        <date-time-picker :value="value"
                          :width="width"
                          @input="onInput"
                          @cancel="onCancel"></date-time-picker>
    </v-dialog>
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
  @Prop({default: 320}) public width!: number;
  @Prop({default: null}) public value!: string;

  public display: boolean = false;

  public onInput(dateTime: string) {
    this.display = false;
    this.$emit('input', dateTime);
  }

  public onCancel() {
    this.display = false;
    this.$emit('cancel');
  }

}
</script>
