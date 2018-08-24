<template>
  <v-layout>
    <v-flex xs12 v-if="agentNodes.length > 0">   
      <v-layout row v-if="showSearcher">
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
            <div class="agent-node-wrapper">
              <agent-node :agentNode="node"
                          @click.native="onClick(node)"></agent-node>
              <v-icon v-if="removable"
                      @click="onRemove(node)"
                      class="agent-node-wrapper__delete" 
                      color="error" 
                      medium>cancel</v-icon>
            </div>
          </v-flex>
          <v-flex v-if="!filteredAgentNodes || filteredAgentNodes.length === 0">
            <h4 class="headline text-xs-center">No nodes found matching the given filter...</h4>
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
import config from 'config';

@Component({
  components: {
    AgentNode,
  },
})
export default class AgentNodeCollection extends Vue {
  @Prop() public agentNodes!: ConsensusAgentNode[];
  @Prop({default: config.app.minNodesForSearcher}) public minNodesForSearcher!: number;
  @Prop({default: false}) public removable!: boolean;
  public filter: string = '';

  get showSearcher(): boolean {
    return this.minNodesForSearcher !== -1 && this.agentNodes.length > this.minNodesForSearcher;
  }

  get filteredAgentNodes(): ConsensusAgentNode[] {

    if (this.filter) {
      const filterLowerCased: string = this.filter.toLowerCase();

      return this.agentNodes.filter((node: ConsensusAgentNode) =>
        (node.agentId.toLowerCase().indexOf(filterLowerCased) >= 0) ||
        ((node.agentName ? node.agentName : node.agentAddress).toLowerCase().indexOf(filterLowerCased) >= 0),
      );
    } else {
      return this.agentNodes;
    }

  }

  public onClick(node: ConsensusAgentNode) {
    this.$emit('nodeSelected', node);
  }

  public onRemove(node: ConsensusAgentNode) {
    this.$emit('nodeRemoved', node);
  }
}
</script>

<style lang="scss" scoped>
  .agent-node-wrapper {
    position: relative;

    &__delete {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%) scale(0);
      transition: all .1s 0s ease-out;
    }

    &:hover {
      .agent-node-wrapper__delete {
        display: block;
        transform: translate(50%, -50%) scale(1);

        &:hover {
          transform: translate(50%, -50%) scale(1.3);
        }
      }
    }
  }
</style>
