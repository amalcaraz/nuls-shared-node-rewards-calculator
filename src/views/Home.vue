<template>
  <AgentNodeCollection :agentNodes="allAgentNodes"></AgentNodeCollection>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AgentNodeCollection from '@/components/AgentNodeCollection.vue';
import { mapGetters } from 'vuex';

@Component({
  components: {
    AgentNodeCollection,
  },
  computed: {
    ...mapGetters(['allAgentNodes']),
  },
})
export default class Home extends Vue {
}
</script>
