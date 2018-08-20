<template>
  <v-form @submit.prevent="onSubmit" v-model="valid" ref="form">
    <v-card class="title">
      <v-card-title>
        New Staker
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="Address *"
          v-model="modelStaker.address"
          type="text"
          :rules="addressRules"
          required
          :disabled="!!staker"
        ></v-text-field>
        <v-text-field
          label="Staked Nuls *"
          min="0"
          step=".01"
          v-model="modelStaker.staked"
          type="number"
          :rules="stackedRules"
          required
        ></v-text-field>
        <v-text-field
          label="Alias"
          v-model="modelStaker.alias"
          type="text"
        ></v-text-field>
        <v-text-field
          label="Email"
          v-model="modelStaker.email"
          type="email"
          :rules="emailRules"
        ></v-text-field>
        <v-text-field
          label="Profit rate"
          min="0"
          step=".01"
          v-model="modelStaker.profitRate"
          type="number"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" type="submit" :disabled="!valid">Submit</v-btn>
        <v-btn color="reset" flat @click.stop="$refs.form.reset()">Reset</v-btn>
        <v-btn color="error" flat @click.stop="onCancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { NodeStaker } from '@/model/stakers';
import { isValidAddress, nulsDecimalsToInt, nulsIntToDecimals } from '../services/utils';

@Component({})
export default class AgentNodeNewStakerForm extends Vue {

  @Prop() public staker!: NodeStaker;

  public valid: boolean = false;
  public modelStaker: any = {};

  public addressRules: any = [
    (value: string) => isValidAddress(value) || 'Invalid address',
    (value: string) => !!value || 'Address is required',
  ];

  public emailRules: any = [
    (value: string) => !value || /.+@.+/.test(value) || 'E-mail must be valid',
  ];

  public stackedRules: any = [
    (value: string) => !!value || 'Staked is required',
  ];

  @Watch('staker')
  public onStakerChange(val: NodeStaker, oldVal: NodeStaker) {
    this.clearForm();
    this.modelStaker = {...val};

    if (val && val.staked) {
      this.modelStaker.staked = nulsIntToDecimals(val.staked);
    }
  }

  public onCancel() {
    this.$emit('cancel');
  }

  public onSubmit() {
    if (this.valid) {
      this.$emit('staker', this.getResponse());
    }
  }

  private clearForm() {
    (this.$refs.form as any).reset();
  }

  private getResponse(): NodeStaker {
    const response: NodeStaker = {
      ...this.modelStaker,
      staked: nulsDecimalsToInt(parseFloat(this.modelStaker.staked)),
    };

    if (this.modelStaker.profitRate) {
      response.profitRate = parseFloat(this.modelStaker.profitRate);
    }

    return response;
  }
}
</script>