import Vue from 'vue'
import Router from 'vue-router'

// 页面
import init from '../init.vue'
import index from '../pages/index.vue'
import error from '../pages/error.vue'

import linkupGame from '../pages/linkupGame.vue'
import linkupRank from '../pages/linkupRank.vue'
import dynamic from '../pages/dynamic.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/actweb/linkup/',
  // base: '/',
  routes: [
    {
      path: '/index',
      component: index
    },
    {
      path: '/linkup',
      name: 'linkup',
      component: linkupGame
    },
    {
      path: '/linkupRank/:type',
      name: 'linkupRank',
      component: linkupRank
    },
    {
      path: '/dy',
      name: 'dynamic',
      component: dynamic
    },
    {
      path: '*',
      name: '404',
      component: error
    }
  ]
})