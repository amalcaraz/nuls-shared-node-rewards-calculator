<template>
  <div class="agent-node-credit">
    <span>{{credit}}</span>
    <span class="credit-wrap">
      <span class="credit-bar" :class="creditStatusClass" :style="{width: `${50 + (50 * credit)}%`}"></span>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class AgentNodeCredit extends Vue {
  @Prop() public credit!: number;

  get creditStatusClass(): string {
    if (this.credit > 0.8) {
      return 'credit-bar--full';
    } else if (this.credit > 0.5) {
      return 'credit-bar--active';
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
  background-color: #2c7be5;
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

  &--full {
    background-color: #00d97e !important;
  }

  &--active {
    background-color: #d99f00 !important;
  }
}
</style>
