<template>
  <v-app id="app" dark>
    <v-toolbar app fixed clipped-left class="pa-0">
      <v-container class="py-0 app-toolbar__container">
        <v-layout align-center>
          <v-flex shrink>
            <v-btn flat icon :to="{name: 'home'}" color="transparent" :ripple="false">
              <i id="nuls-logo" class="nuls primary--text"></i>
            </v-btn>
          </v-flex>
          <v-flex>
            <v-toolbar-title class="app-title">
              Shared node rewards calculator
            </v-toolbar-title>
          </v-flex>
        </v-layout>
      </v-container>
    </v-toolbar>
    <v-content>
      <v-container fill-height>
        <v-layout justify-center>
          <v-flex class="loading-flex" v-if="loading">
            <spinner :loading="loading"></spinner>
          </v-flex>
          <v-flex v-else>
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer height="auto">
      <v-container>
        <v-layout wrap>
          <v-flex xs12 sm6 class="mb-3">
            <strong class="subheading">Angel Manzano</strong>
            <div class="caption grey--text">&copy; 2018</div>
          </v-flex>
          <v-flex xs12 sm6 class="text-sm-right">
            <strong class="subheading">Donation address</strong>
            <div class="caption">Nuls: <a href="https://nuls.world/addresses/NsdvprVBQbZLRnXPKiZFBzUbgnnHqi3d" target="_blank" class="grey--text">NsdvprVBQbZLRnXPKiZFBzUbgnnHqi3d</a></div>
            <div class="caption">Btc: <span class="grey--text">1HZNA6VhuLmQrCE77hurCQwx4cNnj4Avg5</span></div>            
            <div class="caption">Eth: <span class="grey--text">0x164f78f362f2be22212c23ce427110a18e2e6b5e</span></div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters('layout', ['loading']),
  },
})
export default class App extends Vue {

  public created() {
    this.$store.dispatch('config/retrieveConfig');
  }

}
</script>

<style lang="scss">
@import "./styles/index.scss";
#app {
  .loading-flex {
    align-self: center;
  }

  .app-title {
    margin-left: 0;
  }

  .app-toolbar__container {
    margin: 0 auto;
  }

  .v-toolbar__content{
    padding: 0;
  }
}

#nuls-logo {
  width: 100%;
  height: 100%;
}
</style>
