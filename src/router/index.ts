import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import TitleView from '../views/TitleView.vue';
import GameView from '../views/GameView.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'TitleView',
    component: TitleView,
  },
  {
    path: '/game',
    // path: '/',
    name: 'Game',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/GameView.vue'),
    component: GameView,
    props: true,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
