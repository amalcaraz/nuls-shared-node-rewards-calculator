<template>
  <v-form @submit.prevent="onSubmit" v-model="valid" ref="form">
    <v-card>
      <v-card-title class="title">
        Percentage reimbursed to staker
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="Reimburse percentage *"
          min="0"
          max="100"
          step=".01"
          v-model="percentageModel"
          type="number"
          :rules="percentageRules"
          required
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" flat @click.stop="onCancel">Cancel</v-btn>
        <v-btn color="warning" flat @click.stop="$refs.form.reset()">Reset</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" type="submit" :disabled="!valid">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class AgentNodeReimburseFeesForm extends Vue {
  @Prop({default: 0}) public percentage!: number;

  public valid: boolean = false;
  public percentageModel: string = this.percentage + '';

  public percentageRules: any = [
    (value: string) => !!value || 'Percentage is required',
    (value: string) => parseFloat(value) >= 0 || 'Should be greater than 0',
    (value: string) => parseFloat(value) <= 100 || 'Should be less than 100',
  ];

  public onCancel() {
    this.$emit('cancel');
    this.clearForm();
  }

  public onSubmit() {
    if (this.valid) {
      this.$emit('submit', parseFloat(this.percentageModel));
      this.clearForm();
    }
  }

  private clearForm() {
    (this.$refs.form as any).reset();
  }

}
</script>