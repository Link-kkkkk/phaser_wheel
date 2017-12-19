<template>
  <!-- 路由入口 -->
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'init',
  data () {
    return {
      h:''
    }
  }
}
</script>
<!-- 这里有坑，不声明lang会用css解析less -->
<style lang='less'>
  @import './assets/common/reset.less';
  #app {
    width:100%;
    min-width:320px;
  }
</style>