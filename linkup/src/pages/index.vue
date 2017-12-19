<template>
  <div class='warp' :style='warp'>
    <div class='icon' :style='icon'></div>
    <preload></preload>
    <down :downLink='href' :linkedMe='linkedMe'></down>
    <share :actData='actData'></share>
  </div>
</template>
<script>
import com from './../util/common'
import backimg from '../../static/404.png'

import down from './../components/down'
import preload from './../components/preload'
import share from './../components/shareInfo'

export default {
  name: 'init',
  components: {
    down,
    preload,
    share
  },
  data() {
    return {
      json: {
        sess_token: com.$_GET('sess_token'),
        act_id: com.$_GET('id'),
        model_idfa: com.$_GET('model_idfa'),
      },
      actData: {
        sess_token: com.$_GET('sess_token'),
        act_id: com.$_GET('id'),
        model_idfa: com.$_GET('model_idfa'),
      },
      href: 'https://www.hxsapp.com/download',
      utime: this.$common.common.$_GET('utime'),
      sign: this.$common.common.$_GET('sign'),
      pageTitle: '',
      warp: null,
      icon: null,
      linkedMe: null
    }
  },
  created() {
    // linkme
    var __url = 'https://app.hxsapp.com/actweb/seckill/invite/user?id=' + com.$_GET('id');
    this.linkedMe = {
      params: {
        // key 是写死的   value是协议，具体见这里－http://wiki.sys.hxsapp.net/pages/viewpage.action?pageId=1998876
        "key": "hxsapp://web?url=" + __url
      }
    }
  },
  mounted() {
    var _this = this

    this.$nextTick(function() {
      // this.$common.common.preLoading("stressing");
      // this.$common.actjs.resizeWindow();
      _this.routerGo();
      var clientH = document.documentElement.clientHeight;
      this.warp = {
        'height': clientH + 'px',
        'width': '100%',
        'background-color': '#d5dde1',
        'background-size': '100% 100%'
      }
      $('.warp').css('height', clientH + 'px');
    })
  },
  methods: {
    routerGo() {
      var _this = this
      switch (this.$common.common.$_GET('route') || this.$route.params.type) {
        default:
          _this.icon = {
            'height': '12.166667rem',
            'width': '17.233333rem',
            'background': 'url(' + backimg + ') top left no-repeat',
            'background-size': '100% 100%'
          }
          break;
      }
    },
  }
}
</script>
<style lang="less" scoped>
@import './../assets/common/reset.less';
.icon {
  position: absolute;
  top: 5rem;
  left: calc(~'50% - 17.23rem/2');
}
</style>