import Vue from 'vue';
import Router from 'vue-router';
import HomeView from './views/Home.vue';
import AddNodeView from './views/AddNode.vue';
import ConfigNodeView from './views/ConfigNode.vue';
import NodeDetailView from './views/NodeDetail.vue';
import store from './store';
import { AppMenu } from '@/model/common';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: 'Your portfolio',
      },
      component: HomeView,
      beforeEnter: async (to, from, next) => {
        await store.dispatch('consensus/fetchAgentNodes');
        next();
      },
    },
    {
      path: '/add-node',
      name: 'add-node',
      meta: {
        title: 'Add a node to your portfolio',
      },
      component: AddNodeView,
      beforeEnter: async (to, from, next) => {
        await store.dispatch('consensus/fetchAgentNodes');
        next();
      },
    },
    {
      path: '/config-node/:hash',
      name: 'config-node',
      meta: {
        title: 'Node configuration',
      },
      component: ConfigNodeView,
      beforeEnter: async (to, from, next) => {
        const nodeHash = to.params.hash;
        await store.dispatch('consensus/fetchAgentNodeDetail', nodeHash);
        next();
      },
    },
    {
      path: '/node-detail/:hash',
      name: 'node-detail',
      meta: {
        title: 'Node rewards detailed',
        menu: [
          { label: 'Node configuration', to: { name: 'config-node'} },
        ] as AppMenu,
      },
      component: NodeDetailView,
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
