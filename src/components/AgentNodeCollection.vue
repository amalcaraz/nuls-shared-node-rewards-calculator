<template>
  <v-layout>
    <v-flex xs12 v-if="agentNodes.length > 0">   
      <v-layout row v-if="agentNodes.length > 10">
        <v-flex xs12>
          <v-text-field
            solo
            label="Search"
            append-icon="search"
            v-model="filter"
          ></v-text-field>
        </v-flex>
      </v-layout> 
      <v-container class="pa-0" grid-list-lg fluid>
        <v-layout row wrap>
          <v-flex xs12 sm6 lg4 v-for="node in filteredAgentNodes"
                    v-if="node"
                    :key="node.agentId">
            <agent-node :agentNode="node"></agent-node>
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
  public filter: string = '';

  get filteredAgentNodes(): ConsensusAgentNode[] {
    return this.agentNodes.filter((node: ConsensusAgentNode) =>
      (node.agentId.indexOf(this.filter) >= 0) ||
      ((node.agentName ? node.agentName : node.agentAddress).indexOf(this.filter) >= 0));
  }
}
</script>

<style lang="scss" scoped>

</style>
