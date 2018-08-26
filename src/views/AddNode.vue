<template>
  <agent-node-collection :agentNodes="allAgentNodes"
                         @nodeSelected="onNodeSelected"></agent-node-collection>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ConsensusAgentNode } from '../model/consensus';
import AgentNodeCollection from '@/components/AgentNodeCollection.vue';
import { mapGetters } from 'vuex';
import { ConfigNode } from '@/model/config';

@Component({
  components: {
    AgentNodeCollection,
  },
  computed: {
    ...mapGetters('consensus', ['allAgentNodes']),
  },
})
export default class AddNodeView extends Vue {
  public onNodeSelected(node: ConsensusAgentNode) {
    // this.$store.dispatch('config/addNode', { agentNodeId: node.agentId } as ConfigNode);
    this.$router.push({ name: 'config-node', params: { hash: node.agentHash } });
  }
}
</script>
