import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';

export const customTheme = {
  ...colors.teal,
  base: '#8ab54d',
  primary: '#8ab54d',
  secondary: '#658ec7',
  error: '#d43d3d',
  success: '#8ab54d',
};

// console.log(customTheme);

Vue.use(Vuetify, {
  theme: {
    primary: customTheme.primary,
    secondary: customTheme.secondary,
    accent: customTheme.error,
    error: customTheme.error,
    success: customTheme.success,
  },
});
