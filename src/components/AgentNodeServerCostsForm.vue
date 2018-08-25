<template>
  <v-card>
    <v-card-title class="title">
      Server costs
    </v-card-title>
    <v-card-text>
      <v-select
        :items="currencies"
        v-model="selectedCurrency"
        label="Currency"
        item-value="text"
      ></v-select>
      <v-text-field
        :label="'Price in ' + selectedCurrency"
        v-model="priceInCurrency"
        type="number"
      ></v-text-field>
      <v-layout align-center>
        <v-flex v-show="loading" shrink class="pr-2">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-flex>
        <v-flex>
          <v-text-field
            v-show="selectedCurrency !== ConfigCurrencyType.NULS"
            label="Price in Nuls"
            :value="priceInNuls | nulsCurrency"
            type="text"
            :disabled="!priceInNuls"
            readonly
          ></v-text-field>
        </v-flex>
      </v-layout>
     
    </v-card-text>
    <v-card-actions>
      <v-btn color="error" flat @click.stop="onCancel">Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click.stop="onSubmit" :disabled="submitDisabled">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { customTheme } from '../vendor';
import { ConfigServerCosts, ConfigCurrencyType } from '@/model/config';
import { balanceNumber } from '@/model/common';
import { NulsPriceResponse, ServerCostsPrice } from '../model/price';
import * as priceService from '../services/price';
import debounce from 'debounce';
import { nulsDecimalsToInt } from '../services/utils';

@Component({})
export default class AgentNodeServerCostsForm extends Vue {
  @Prop() public serverCosts!: ServerCostsPrice;

  public ConfigCurrencyType = ConfigCurrencyType;
  public currencies: string[] = Object.keys(ConfigCurrencyType);
  public selectedCurrency: ConfigCurrencyType = this.currencies[0] as ConfigCurrencyType;
  public priceInCurrency: string = '';
  public priceInNuls: balanceNumber = 0;
  public loading: boolean = false;

  private calculatePriceDebounced = debounce(() => this.calculatePrice(), 500, false);

  @Watch('serverCosts', { immediate: true })
  public onServerCostsChange(val: ServerCostsPrice, oldVal: ServerCostsPrice) {
    this.selectedCurrency = this.serverCosts && this.serverCosts.currency
      ? this.serverCosts.currency
      : this.currencies[0] as ConfigCurrencyType;

    this.priceInCurrency = this.serverCosts && this.serverCosts.price
      ? this.serverCosts.price.toString()
      : '';

    this.priceInNuls = this.serverCosts && this.serverCosts.nulsPrice
      ? this.serverCosts.nulsPrice
      : 0;

    this.calculatePrice();

  }

  @Watch('selectedCurrency')
  public onSelectedCurrencyChange(val: string, oldVal: string) {
    this.calculatePrice();
  }

  @Watch('priceInCurrency')
  public onPriceChange(val: string, oldVal: string) {
    this.calculatePriceDebounced();
  }

  get submitDisabled(): boolean {
    return !this.selectedCurrency || !this.priceInCurrency || (parseFloat(this.priceInCurrency) < 0);
  }

  public onCancel() {
    this.$emit('cancel');
  }

   public onSubmit() {
    this.$emit('serverCosts', this.getResponse());
  }

  private async calculatePrice() {

    const priceInCurrency: number = parseFloat(this.priceInCurrency);

    if (priceInCurrency > 0) {
      this.loading = true;

      let nulsPriceResponse: NulsPriceResponse | undefined;

      if (ConfigCurrencyType[this.selectedCurrency] !== ConfigCurrencyType.NULS) {
        nulsPriceResponse = await priceService.getNulsPrice();
      }

      this.priceInNuls = await priceService.calculateNulsPrice(priceInCurrency, this.selectedCurrency, nulsPriceResponse);

      this.loading = false;
    }

  }

  private getResponse(): ServerCostsPrice | null {

    const priceInCurrency: number = parseFloat(this.priceInCurrency);

    if (priceInCurrency > 0) {
      return {
        currency: this.selectedCurrency,
        price: priceInCurrency,
        nulsPrice: this.priceInNuls,
      };
    } else {
      return null;
    }
  }

}
</script>