import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import AddNode from './views/AddNode.vue';
import NodeDetail from './views/NodeDetail.vue';
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
    {
      path: '/add-node',
      name: 'add-node',
      component: AddNode,
      beforeEnter: async (to, from, next) => {
        await store.dispatch('consensus/fetchAgentNodes');
        next();
      },
    },
    {
      path: '/node-detail/:hash',
      name: 'node-detail',
      component: NodeDetail,
      beforeEnter: async (to, from, next) => {
        const nodeHash = to.params.hash;
        await store.dispatch('consensus/fetchAgentNodeDetail', nodeHash);
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
  store.commit('layout/setLoading', true);
  next();
});

router.afterEach((to, form) => {
  store.commit('layout/setLoading', false);
});

export default router;
