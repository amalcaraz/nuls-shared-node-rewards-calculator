<template>
  <span>
    <i :class="['status', `status--${status}`, creditClass]"></i> {{status | agentNodeStatus(credit)}}
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ConsensusAgentNodeStatus, ConsensusAgentNodeCredit } from '../model/consensus';

@Component({})
export default class AgentNodeStatus extends Vue {
  @Prop() public status!: ConsensusAgentNodeStatus;
  @Prop({default: 0}) public credit!: number;

   get creditClass(): string {
    if (this.credit > ConsensusAgentNodeCredit.max) {
      return 'credit--max';
    } else if (this.credit > ConsensusAgentNodeCredit.med) {
      return 'credit--med';
    } else {
      return '';
    }
  }
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

    &.credit--max {
      background-color: var(--color-success);
    }

    &.credit--med {
      background-color: var(--color-warning);
    }

  }
}
</style>
