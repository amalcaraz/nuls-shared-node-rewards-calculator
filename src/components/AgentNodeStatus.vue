<template>
  <span>
    <i :class="['status', `status--${status}`]"></i> {{status | agentNodeStatus}}
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ConsensusAgentNodeStatus } from '../model/consensus';

@Component({})
export default class AgentNodeStatus extends Vue {
  @Prop() public status!: ConsensusAgentNodeStatus;
}
</script>

<style lang="scss" scoped>
.status {
  $size: .5em;

  display: inline-block;
  width: $size;
  height: $size;
  vertical-align: middle;
  border-radius: 50%;
  background-color: var(--color-grey);

  &--1 {
    background-color: var(--color-success);
  }
}
</style>
