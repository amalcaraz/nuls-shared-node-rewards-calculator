<template>
  <v-form @submit.prevent="onSubmit" v-model="valid" ref="form">
    <v-container fluid class="pa-0">
      <v-layout>
        <v-flex>
          <h1 class="long-text">Node <span class="primary--text">{{agentNode.agentName ? agentNode.agentName : agentNode.agentAddress}}</span></h1>

          <v-divider class="my-4"></v-divider>

          <h2 class="title">How do you want to distribute the node rewards?</h2>
          <v-select item-text="label"
                    item-value="type"
                    :items="configTypes"
                    v-model="selectedConfigType"
                    ></v-select>
          <small><v-icon small>info</v-icon>{{configTypes[selectedConfigType].description}}</small>
          
          <v-divider class="my-4"></v-divider>

          <h2 class="title">How are we going to calculate the rewards?</h2>
          <v-switch :label="serverCostsSwitchLabel"
                    hide-details
                    v-model="switchServerCosts"
                    color="primary"></v-switch>
          <agent-node-server-costs-form v-if="switchServerCosts && !serverCostsSubmitted"
                                        class="mt-2"
                                        :serverCosts="serverCostsModel"
                                        @serverCosts="onServerCostsSubmit"
                                        @cancel="onServerCostsCancel"></agent-node-server-costs-form>

          <v-switch label="Pay staking rewards to node owner"
                    hide-details
                    v-model="switchOwnerStaking"
                    color="primary"></v-switch>

          <v-switch :label="reimburseFeesSwitchLabel"
                    hide-details
                    v-model="switchReimburseFees"
                    color="primary"></v-switch>
          <agent-node-reimburse-fees-form v-if="switchReimburseFees && !reimburseFeesSubmitted"
                                          class="mt-2"
                                          :percentage="agentNode.commissionRate"
                                          @submit="onReimburseFeesSubmit"
                                          @cancel="onReimburseFeesCancel"></agent-node-reimburse-fees-form>
          
          <v-divider class="my-4"></v-divider>
        </v-flex>        
      </v-layout>
      <v-layout>
        <v-btn color="error" flat @click="onCancel" :disabled="!agentConfig">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" type="submit" :disabled="!valid">Save config</v-btn>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import AgentNodeServerCostsForm from './AgentNodeServerCostsForm.vue';
import AgentNodeReimburseFeesForm from './AgentNodeReimburseFeesForm.vue';
import { ConsensusAgentNode } from '../model/consensus';
import { ConfigServerCosts, ConfigTypeMap, ConfigType, CONFIG_TYPES, ConfigNode } from '../model/config';
import { ServerCostsPrice } from '../model/price';


@Component({
  components: {
    AgentNodeServerCostsForm,
    AgentNodeReimburseFeesForm,
  },
})
export default class AgentNodeConfigurationForm extends Vue {
  @Prop() public agentNode!: ConsensusAgentNode;
  @Prop() public agentConfig!: ConfigNode;

  public valid: boolean = false;
  public configTypes: ConfigTypeMap[] = CONFIG_TYPES;
  public selectedConfigType: ConfigType = CONFIG_TYPES[0].type;

  public switchServerCosts: boolean = false;
  public serverCostsSubmitted: boolean = false;
  public serverCostsModel: ConfigServerCosts | null = null;

  public switchOwnerStaking: boolean = false;

  public switchReimburseFees: boolean = false;
  public reimburseFeesSubmitted: boolean = false;
  public reimburseFeesModel: number | null = null;

  @Watch('agentConfig', { immediate: true })
  public onAgentConfigChange(val: ConfigNode) {

    this.selectedConfigType = this.agentConfig && this.agentConfig.configType
      ? this.agentConfig.configType
      : CONFIG_TYPES[0].type;

    this.serverCostsModel = this.agentConfig && this.agentConfig.serverCosts
      ? this.agentConfig.serverCosts
      : null;

    if (this.serverCostsModel) {
      this.switchServerCosts = true;
      this.serverCostsSubmitted = true;
    }

    this.switchOwnerStaking = this.agentConfig && this.agentConfig.ownerStaking
      ? this.agentConfig.ownerStaking
      : false;

    this.reimburseFeesModel = this.agentConfig && this.agentConfig.reimburseFees
      ? this.agentConfig.reimburseFees
      : null;

    if (this.reimburseFeesModel) {
      this.switchReimburseFees = true;
      this.reimburseFeesSubmitted = true;
    }
  }

  get serverCostsSwitchLabel(): string {
    const costs: string = this.serverCostsModel
      ? `(${this.serverCostsModel.price} ${this.serverCostsModel.currency})`
      : '';
    return `Deduct server costs ${costs}`;
  }

  get reimburseFeesSwitchLabel(): string {
    const costs: string = this.reimburseFeesModel
      ? `(${this.reimburseFeesModel}%)`
      : '';
    return `Reimburse stakers fees ${costs}`;
  }

  @Watch('switchServerCosts')
  public switchServerCostsChanged(value: boolean) {
    this.serverCostsSubmitted = false;
    if (!value) {
      this.serverCostsModel = null;
    }
  }

  @Watch('switchReimburseFees')
  public switchReimburseFeesChanged(value: boolean) {
    this.reimburseFeesSubmitted = false;
    if (!value) {
      this.reimburseFeesModel = null;
    }
  }

  public onServerCostsSubmit(serverCostsPrice: ServerCostsPrice | null) {

    if (!serverCostsPrice) {

      this.onServerCostsCancel();

    } else {

      this.serverCostsModel = {
        currency: serverCostsPrice.currency,
        price: serverCostsPrice.price,
      };

    }

    this.serverCostsSubmitted = true;

  }

  public onServerCostsCancel() {
    this.switchServerCosts = false;
    this.serverCostsModel = null;
  }

  public onReimburseFeesSubmit(percentage: number) {

    if (percentage <= 0) {

      this.onReimburseFeesCancel();

    } else {

      this.reimburseFeesModel = percentage;

    }

    this.reimburseFeesSubmitted = true;

  }

  public onReimburseFeesCancel() {
    this.switchReimburseFees = false;
    this.reimburseFeesModel = null;
  }

  public onCancel() {
    this.$emit('cancel');
  }

  public onSubmit() {
    this.$emit('submit', this.getResponse());
  }

  private getResponse(): ConfigNode {
    const configNode: ConfigNode = {
      ...this.agentConfig,
      agentNodeId: this.agentConfig ? this.agentConfig.agentNodeId : this.agentNode.agentId,
      configType: this.selectedConfigType !== null ? this.selectedConfigType : undefined,
      serverCosts: this.serverCostsModel !== null ? this.serverCostsModel : undefined,
      ownerStaking: this.switchOwnerStaking !== null ? this.switchOwnerStaking : undefined,
      reimburseFees: this.reimburseFeesModel !== null ? this.reimburseFeesModel : undefined,
    };

    return configNode;
  }

}
</script>
