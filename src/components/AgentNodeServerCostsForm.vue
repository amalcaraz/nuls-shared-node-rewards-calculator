<template>
  <v-dialog v-model="isOpen" persistent max-width="500px">
    <v-card class="title">
      <v-card-title>
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
        <v-text-field
          v-show="selectedCurrency !== ConfigCurrencyType.NULS"
          label="Price in Nuls"
          :value="priceInNuls | nulsCurrency"
          type="text"
          :disabled="!priceInNuls"
          readonly
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click.stop="onSubmit">Submit</v-btn>
        <v-btn color="error" flat @click.stop="onClose">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
  @Prop() public open!: boolean;
  @Prop() public serverCosts!: ServerCostsPrice;

  public isOpen: boolean = false;
  public ConfigCurrencyType = ConfigCurrencyType;
  public currencies: string[] = Object.keys(ConfigCurrencyType);
  public selectedCurrency: ConfigCurrencyType = {} as ConfigCurrencyType;
  public priceInCurrency: string = '';
  public priceInNuls: balanceNumber = 0;

  private calculatePriceDebounced = debounce((price: string, currency: ConfigCurrencyType) => this.calculatePrice(price, currency), 500, false);

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
  }

  @Watch('open', { immediate: true })
  public onOpenChange(val: boolean, oldVal: boolean) {
    this.isOpen = val;
  }

  @Watch('selectedCurrency')
  public onSelectedCurrencyChange(val: string, oldVal: string) {
    this.calculatePrice(this.priceInCurrency, this.selectedCurrency);
  }

  @Watch('priceInCurrency')
  public onPriceChange(val: string, oldVal: string) {
    this.calculatePriceDebounced(this.priceInCurrency, this.selectedCurrency);
  }

  public onClose() {
    this.isOpen = false;
    this.$emit('update:open', false);
    this.$emit('close');
  }

   public onSubmit() {
    this.$emit('serverCosts', this.getResponse());
    this.onClose();
  }

  private async calculatePrice(price: string, currency: ConfigCurrencyType) {
    const nulsPriceResponse: NulsPriceResponse = await priceService.getNulsPrice();
    this.priceInNuls = await priceService.calculateNulsPrice(parseFloat(price), currency, nulsPriceResponse);
  }

  private getResponse(): ServerCostsPrice {
    return {
      currency: this.selectedCurrency,
      price: parseFloat(this.priceInCurrency),
      nulsPrice: this.priceInNuls,
    };
  }

}
</script>