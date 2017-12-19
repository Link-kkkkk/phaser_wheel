<template>
  <div class="stressing" v-if="preLoad">
    <span></span>
  </div>
</template>
<script>
export default {
  name: 'preLoad',
  data() {
    return {
      preLoad: true
    }
  },
  mounted() {
    var _this = this
    this.$nextTick(() => {
      _this.preLoading();
    })
  },
  methods: {
    preLoading() {
      var _this = this;

      function finish() {
        _this.preLoad = false
      }

      document.onreadystatechange = function() {
        if (document.readyState == 'complete' || document.readyState == 'loaded') {
          finish();
        }
      }

      if (document.readyState == 'complete' || document.readyState == 'loaded') {
        setTimeout(() => {
          finish();
        }, 200)
      }
    }
  },
}
</script>
<style>
.stressing {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: #fff;
  z-index: 9999999999999;
}

.stressing span {
  width: 100px;
  height: 120px;
  background: url(./../assets/img/common/loading.gif) left top no-repeat;
  background-size: 100px;
  position: absolute;
  left: 50%;
  top: 45%;
  margin-left: -50px;
  margin-top: -60px;
}
</style>