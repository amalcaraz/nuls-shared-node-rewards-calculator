import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import store from './store';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: async (to, from, next) => {
        await store.dispatch('consensus/fetchAgentNodes');
        next();
      },
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ],
});

router.beforeEach((to, form, next) => {
  store.commit('layout/loading', true);
  next();
});

router.afterEach((to, form) => {
  store.commit('layout/loading', false);
});

export default router;
