<template>
  <div class="agent-node-credit">
    <span>{{credit}}</span>
    <span class="credit-wrap">
      <span class="credit-bar" :class="creditClass" :style="{width: `${50 + (50 * credit)}%`}"></span>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ConsensusAgentNodeCredit } from '../model/consensus';

@Component({})
export default class AgentNodeCredit extends Vue {
  @Prop() public credit!: number;

  get creditClass(): string {
    if (this.credit > ConsensusAgentNodeCredit.max) {
      return 'credit-bar--max';
    } else if (this.credit > ConsensusAgentNodeCredit.med) {
      return 'credit-bar--med';
    } else {
      return '';
    }
  }
}
</script>

<style lang="scss" scoped>

.agent-node-credit {
  display: flex;
  align-items: center;
}

.credit-wrap {
  height: 0.25rem;
  font-size: 0.70312rem;
  margin-left: 1em;
  flex: 1 0 auto;
  display: flex;
  overflow: hidden;
  border-radius: 200px;
  background-color: #edf2f9;
}

.credit-bar {
  display: flex;
  flex-direction: column;
  transition: width 0.6s ease;
  text-align: center;
  white-space: nowrap;
  color: #fff;
  background-color: var(--color-grey);
  justify-content: center;
  border-radius: 200px;
  background-image: linear-gradient(
    45deg,
    hsla(0, 0%, 100%, 0.15) 25%,
    transparent 0,
    transparent 50%,
    hsla(0, 0%, 100%, 0.15) 0,
    hsla(0, 0%, 100%, 0.15) 75%,
    transparent 0,
    transparent
  );
  background-size: 1rem 1rem;

  &--max {
    background-color: var(--color-success) !important;
  }

  &--med {
    background-color: var(--color-warning) !important;
  }
}
</style>
