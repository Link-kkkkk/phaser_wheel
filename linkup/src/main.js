// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from './App'

import Router from 'vue-router'
import VueResource from 'vue-resource'
import router from './router'
import "babel-polyfill"

// 页面
import init from './init.vue'

// mint
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

// swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'

// vueg
import vueg from 'vueg'
import 'vueg/css/transition-min.css'

// global
import "@/assets/common/animate.css"

import common from './assets/common/index'
Vue.prototype.$common = common

Vue.use(Router)
// Vue.use(MintUI)
Vue.use(VueResource)
Vue.use(VueAwesomeSwiper)
Vue.config.productionTip = false

new Vue({
  el: '#index',
  router,
  render: e => e(init)
})

// vueg配置
const options={
  duration: '0.3',              //转场动画时长，默认为0.3，单位秒
  firstEntryDisable: false,     //值为true时禁用首次进入应用时的渐现动画，默认为false
  firstEntryDuration: '.6',     //首次进入应用时的渐现动画时长，默认为.6
  forwardAnim: 'slideInRight',   //前进动画，默认为fadeInRight
  backAnim: 'fadeInLeft',       //后退动画，默认为fedeInLeft
  sameDepthDisable: false,      //url深度相同时禁用动画，默认为false
  // tabs: [],                     //默认为[]，name对应路由的name,以实现类似app中点击tab页面水平转场效果，如tab[1]到tab[0]，会使用backAnim动画，tab[1]到tab[2]，会使用forwardAnim动画
  tabsDisable: false,           //值为true时，tabs间的转场没有动画，默认为false
  disable: false,               //禁用转场动画，默认为false，嵌套路由默认为true
}
//这句话必须要在new router之后
Vue.use(vueg, router,options)