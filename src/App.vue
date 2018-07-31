<template>
  <v-app id="app">
    <v-toolbar app fixed dark color="primary" clipped-left>
      <v-btn icon>
        <i class="nuls dark"></i>
      </v-btn>
      <v-toolbar-title>
        Shared node rewards calculator
      </v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fill-height>
        <v-layout justify-center>
          <v-flex> 
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer dark color="primary">
       <span>&nbsp;&nbsp;amalcaraz89@gmail.com &copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<style lang="scss">
@import "./styles/index.scss";
#app {
  .nuls {
    width: 100%;
    height: 100%;
  }
}
</style>
