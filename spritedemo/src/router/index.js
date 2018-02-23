import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import main from './../pages/back'
Vue.use(Router)

export default new Router({
  mode:"history",
  base:"/",
  routes: [
    {
      path: '/',
      name: 'main',
      component: main
    }
  ]
})
