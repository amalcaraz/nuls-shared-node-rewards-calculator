<template>
  <div class="home">
    <v-layout wrap justify-space-around>
      <div v-if="!userNodes || userNodes.length === 0">
        <h4 class="headline text-xs-center">There are no nodes <br/> Add the first one!</h4>
      </div>
      <agent-node-collection v-else
                         :agentNodes="userNodes"
                         :removable="true"
                         @nodeSelected="onNodeSelected"
                         @nodeRemoved="onNodeRemoved"></agent-node-collection>
    </v-layout>
    <v-btn :to="{name: 'add-node'}" absolute dark fab bottom right color="primary">
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import AgentNodeCollection from '@/components/AgentNodeCollection.vue';
import { ConsensusAgentNode } from '@/model/consensus';
import { ConfigNode } from '@/model/config';

@Component({
  components: {
    AgentNodeCollection,
  },
  computed: {
    ...mapGetters('config', ['allNodes']),
    ...mapGetters('consensus', ['allAgentNodes']),
  },
})
export default class HomeView extends Vue {
  private allNodes!: ConfigNode[];
  private allAgentNodes!: ConsensusAgentNode[];

  get userNodes(): ConsensusAgentNode[] {
    return this.allAgentNodes.filter((agentNode: ConsensusAgentNode) =>
      this.allNodes.some(
        (configNode: ConfigNode) => configNode.agentNodeId === agentNode.agentId,
      ),
    );
  }

  public onNodeSelected(node: ConsensusAgentNode) {
    this.$router.push({ name: 'node-detail', params: { hash: node.agentHash } });
  }

  public onNodeRemoved(node: ConsensusAgentNode) {
    debugger
    this.$store.dispatch('config/removeNode', { agentNodeId: node.agentId } as ConfigNode);
  }

}
</script>

<style lang="scss" scoped>
  .home {
    position: relative;
    padding-bottom: 3em;
    margin-bottom: 2em;
  }
</style>
