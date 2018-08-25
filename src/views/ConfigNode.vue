<template>
  <agent-node-configuration-form :agentConfig="currentAgentNodeConfig"
                                 :agentNode="currentAgentNode"
                                 @cancel="onCancel"
                                 @submit="onSubmit"></agent-node-configuration-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ConsensusAgentNode } from '../model/consensus';
import { ConfigNode } from '../model/config';
import AgentNodeConfigurationForm from '@/components/AgentNodeConfigurationForm.vue';

@Component({
  components: {
    AgentNodeConfigurationForm,
  },
})
export default class ConfigNodeView extends Vue {

  get currentAgentNode(): ConsensusAgentNode {
    return this.$store.getters['consensus/agentNodeByHash'](
      this.$route.params.hash,
    );
  }

  get currentAgentNodeConfig(): ConfigNode {
    return this.$store.getters['config/nodeConfig'](
      this.currentAgentNode.agentId,
    );
  }

  public onSubmit(configNode: ConfigNode) {
    this.$store.dispatch('config/updateNode', configNode);
    this.$router.push({ name: 'node-detail', params: { hash: this.currentAgentNode.agentHash } });
  }

  public onCancel() {
    this.$router.push({ name: 'node-detail', params: { hash: this.currentAgentNode.agentHash } });
  }

}
</script>
