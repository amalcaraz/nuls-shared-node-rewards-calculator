<template>
  <pulse-loader :loading="loading" 
                :color="customTheme.primary" 
                :size="(size + 'px')"
                :style="{width: (size*4) + 'px', margin: '0 auto'}"></pulse-loader>
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
  @Prop({default: 25}) public size!: number;
  @Prop() public loading!: boolean ;
  public customTheme: any = customTheme;
}
</script>