<template>
  <v-layout>
    <spinner :loading="agentNodes.length == 0"></spinner>
    <v-flex xs12 v-if="agentNodes.length > 0">    
      <v-container grid-list-lg fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 lg4 v-for="node in agentNodes"
                  v-if="node"
                  :key="node.agentId">
          <agent-node
                  :agentNode="node"
                  @remove="onRemoveQr">
          </agent-node>
        </v-flex>
      </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ConsensusAgentNode } from '../model/consensus';
import AgentNode from '@/components/AgentNode.vue';

@Component({
  components: {
    AgentNode,
  },
})
export default class AgentNodeCollection extends Vue {
  @Prop() public agentNodes!: ConsensusAgentNode[];

  private formIsOpen: boolean = false;

  // public created() {
  //   (this as any).retrieveQrs();
  // }

  // public onSubmit(qr: string) {
  //   (this as any).insertQrs(qr);
  //   this.closeForm();
  //   this.saveQrs();
  // }

  // public onRemoveQr(qr: string) {
  //   (this as any).removeQrs(qr);
  //   this.saveQrs();
  // }

  // public openForm() {
  //   this.formIsOpen = true;
  // }

  // public closeForm() {
  //   this.formIsOpen = false;
  // }

  // private saveQrs() {
  //   (this as any).storeQrs();
  // }
}
</script>
