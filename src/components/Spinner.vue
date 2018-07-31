<template>
  <pulse-loader :loading="loading" :color="customTheme.primary" :size="size"></pulse-loader>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { customTheme } from '../vendor';
import pulseLoader from 'vue-spinner/src/PulseLoader.vue';

@Component({
  components: {
    pulseLoader,
  },
})
export default class Spinner extends Vue {
  @Prop({default: '25px'}) public size!: string;
  @Prop() public loading!: boolean ;
  public customTheme: any = customTheme;
}
</script>
