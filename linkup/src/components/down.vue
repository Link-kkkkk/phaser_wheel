<template>
  <div class="warp">
    <transition name="downAni">
      <div class="down_hxs" v-if="downShow">
        <span class="close" @click="closeDownBar"></span>
        <div class="bg"></div>
        <div class="down_main">
          <div class="logo"></div>
          <div class="text">我瘦了,你随意</div>
          <!-- <a :href="downLink">下载APP</a> -->
          <div id="LinkedMeDom">
            <!--
      						<a id="LinkedMeDom">下载APP</a>
      										-->
          </div>
        </div>
        <div class="share-img" v-if="shareImgShow && shareImgStyle" @click="downHxs()" :style="shareImgStyle"></div>
      </div>
    </transition>
  </div>
</template>
<script>
import com from './../util/common'

export default {
  name: 'down',
  data() {
    return {
      // downLink: 'https://www.hxsapp.com/download',
      shareImgShow: false,
      shareStyle: null,
      shareSeizeSeatStyle: null,
      downShow: false,
      shareImgLink: '',
    }
  },
  props: {
    linkedMe: {
      type: Object,
      default: function() {
        return {}
      }
    },
    donwLink: {
      type: [String],
      default: 'https://www.hxsapp.com/download',
    }
  },
  mounted() {
    this.hxsDownload();
    this.install()
    // if (this.downData.url) {
    //   this.downLink = this.downData.url
    // }
    if (com.$_GET('shareType') == 1) {
      this.downShow = true
    }

    // 旧版兼容
    this.$nextTick(() => {
      $('.d_foot').hide();
    })
    // console.log(this.linkedMe)
  },
  methods: {
    hxsDownload() {
      // var ua = window.navigator.userAgent;
      // var IsAndroid = new RegExp('Android').test(ua);
      // var isAndroidQQ = new RegExp('Mobile MQQBrowser').test(ua);
      // var MicroMessenger = new RegExp('MicroMessenger').test(ua);

      // var isIos = new RegExp('iPhone').test(ua);
      // var isIpad = new RegExp('iPad').test(ua);
      // var isIosQQ = new RegExp(' QQ/').test(ua);


      // if (isIos || isIpad) {
      //   // this.downLink = 'https://at.umeng.com/5viObq';
      //   this.downLink = 'https://www.hxsapp.com/download';
      // } else if (IsAndroid) {
      //   // this.downLink = 'https://at.umeng.com/aCKnSD';
      //   this.downLink = 'https://www.hxsapp.com/download';
      // }

      // if ((IsAndroid && isAndroidQQ && !MicroMessenger) || (isIos && isIosQQ) || (isIpad && isIosQQ)) {
      //   this.downLink = 'https://www.hxsapp.com/download';
      // }

      var that = this;

      this.$http.jsonp('https://api.hxsapp.com/base/ad/getAdListByType', { params: { keywords: 'down_load_btn_ad' } })
        .then(function(data) {
          var data = data.data.data[0];
          if (!data.image) return false;
          that.shareImgShow = true;
          that.shareImgLink = data.link;

          var shareImgHeight = parseInt(data.height) / 2;
          that.shareImgStyle = {
            width: parseInt(data.width) / 2 + 'px',
            height: shareImgHeight + 'px',
            background: 'url(' + data.image + ') left top no-repeat',
            backgroundSize: '100%',
            top: -shareImgHeight + 'px'
          }

          that.shareSeizeSeatStyle = {
            height: 59 + shareImgHeight + 'px'
          }
        })

      if (this.linkedMe && com.$_GET('shareType') == 1) {
        com.linkedMe(this.linkedMe)
      }
    },
    downHxs() {
      if (this.shareImgLink) window.location.href = this.shareImgLink;
    },
    install() {
      // 埋点
      // com.newburiedPoint(this.buriedjson)
      this.resizeWindow()
    },
    resizeWindow() {
      function e() {
        var e = document.documentElement.clientWidth,
          t = document.querySelector("html"),
          f = e / 25;
        window.fontSize = f;
        t.style.fontSize = f + "px";
      }
      e(), window.addEventListener("resize", e);
    },
    closeDownBar() {
      this.downShow = false;
      this.shareSeizeSeatStyle = {
        height: 59 + 'px'
      }
    }

  }
}
</script>
<style lang='less'>
.div_none {
  width: 100%;
}

.down_hxs {
  width: 100%;
  height: 50px;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99;
  background: url(../assets/img/common/downloadbg.png) left top no-repeat;
  background-size: 100% 100%;
}

.down_hxs .close {
  width: 11px;
  height: 11px;
  background: url(../assets/img/common/colse.png) left top no-repeat;
  background-size: 100%;
  position: absolute;
  right: 7px;
  top: 8px;
  z-index: 22;
}

.down_hxs .bg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9;
}

.down_hxs .down_main {
  padding: 8px 30px 7px 15px;
  height: 35px;
  position: relative;
  z-index: 10;
}

.down_hxs .logo {
  width: 23px;
	height: 35px;
  border-radius: 5px;
  background: url(../assets/img/common/logo.png) left top no-repeat;
  background-size: 100% 100%;
  float: left;
  margin-right: 7px;
}

.down_hxs .text {
  height: 35px;
  line-height: 35px;
  color: #fff;
  font-size: 16px;
  float: left;
}

.down_hxs a {
  width: 110px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background: #ff68ac;
  float: right;
  color: #fff;
  font-size: 14px;
  border-radius: 22px;
}

.down_hxs .share-img {
  position: absolute;
  right: 5px;
}

.downAni-enter-active {
  animation-name: fadeIn;
  animation-duration: .3s;
}

.downAni-leave-active {
  animation-name: fadeOut;
  animation-duration: .3s;
}

#LinkedMeDom {
  display: none;
  float: right;
  padding: 0 10px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background: #ff68ac;
  border-radius: 22px;
  font-size: 14px;

  .linkedme {
    color: #fff;
  }
}
</style>