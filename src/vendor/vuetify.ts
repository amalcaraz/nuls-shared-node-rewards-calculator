import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';

export const customTheme = {
  ...colors.teal,
  base: '#8ab54d',
  primary: '#8ab54d',
  secondary: '#658ec7',
  error: '#b54d4d',
};

console.log(customTheme);

Vue.use(Vuetify, {
  theme: {
    primary: customTheme.primary,
    secondary: customTheme.secondary,
    accent: colors.shades.black,
    error: customTheme.error,
  },
});
