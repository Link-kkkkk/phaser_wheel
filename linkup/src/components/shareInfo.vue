<template>
  <div>
  </div>
</template>
<script>
import qqShare from './../assets/common/qqShare' //注意路径
import wx from 'weixin-js-sdk'
import com from './../util/common'
export default {
  name: 'shareInfo',
  props: {
    actData: [Object, String],
    default: {
      sess_token: null,
      act_id: null,
      model_idfa: null,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.share()
    })
  },
  methods: {
    share() {
      // console.log('setShareInfo')
      var _this = this
      var json = {
        act_id: this.actData.act_id,
        sess_token: this.actData.sess_token,
        model_idfa: this.actData.model_idfa,
        link: this.actData.link
      }
      this.$http.jsonp('https://act.hxsapp.com' + '/base/Api/actInfo', { params: json })
        .then(function(data) {
          if (data.data.code == 200) {
            var data = data.data.data
            var shareLink = data.link + '&shareType=1&';
            var share_url = { share_url: window.location.href };
            var shareTitle = data.title;
            var shareImages = data.share_pic;
            var shareDescr = data.descr;
            var shareType = data.share_type;

            document.title = data.title
            if (_this.actData.link) {
              shareLink = _this.actData.link + '&shareType=1&';
            }
            if (_this.actData.descr) {
              shareDescr = _this.actData.descr
            }
            // console.log(_this.actData)
            var Version = com.getHxsAppVersion();

            //qq分享
            $('#qqShareContent').attr('content', decodeURIComponent(shareTitle));
            $('#qqShareDes').attr('content', '好享瘦APP  专享福利');
            $('#qqShareImg').attr('content', shareImages);

            //分享方法
            _this.wxSecShare(shareTitle, shareDescr, shareLink, shareImages);
            // this.wxSecShare(shareTitle, shareDescr, shareLink, shareImages);

            if ((_this.$common.common.compareAppVersion(Version, "2.6.0")) && Version) {
              window.location.href = 'https://hxsapp_visible_act_share_btn#' + shareTitle + '#' + shareLink + '#' + shareImages + '#' + shareDescr + '#' + shareType;
            } else if ((_this.$common.common.compareAppVersion(Version, "2.2.0") || Version == "2.2.0") && (!(_this.$common.common.compareAppVersion(Version, "2.6.0") || Version == "2.6.0")) && Version) {
              window.location.href = 'https://hxsapp_visible_share_btn#' + shareTitle + '#' + shareLink + '#' + shareImages + '#' + shareDescr + '#' + shareType;
            } else if ((_this.$common.common.compareAppVersion(Version, "2.1.0") || Version == "2.1.0") && Version) {
              window.location.href = 'hxsapp://visible_share_btn|' + shareTitle + '|' + shareLink + '|' + shareImages + '|' + shareDescr + '|' + shareType;
            }
          }
        })
    },
    wxSecShare(tit, describe, href, img) {
      const _HOST = 'https://app.hxsapp.com';
      const _ACTHOST = 'https://act.hxsapp.com';

      // QQ二次分享
      qqShare.setShareInfo({
        title: tit,
        summary: describe,
        pic: img,
        url: href
      });

      // 微信二次分享
      $.getJSON('https://app.hxsapp.com' + '/base/common/getWxShareJsApiSignature?callback=?', { share_url: window.location.href }, function(data) {
        wx.config({
          debug: false,
          appId: data.data.appId,
          timestamp: data.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.data.noncestr, // 必填，生成签名的随机串
          signature: data.data.signature,// 必填，签名，见附录1
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
        });
        wx.ready(function() {
          wx.onMenuShareTimeline({ //微信分享到朋友圈
            title: tit,
            link: href,
            imgUrl: img,
            success: function() {
            },
            cancel: function() {
            }
          });
          wx.onMenuShareAppMessage({ //微信分享给朋友
            title: tit,
            desc: describe,
            link: href,
            imgUrl: img,
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
            },
            cancel: function() {
            }
          });

          wx.onMenuShareQQ({//分享到qq
            title: tit,
            desc: describe,
            link: href,
            imgUrl: img,
            success: function() {
            },
            cancel: function() {
            }
          });

          wx.onMenuShareWeibo({//分享到qq微博
            title: tit,
            desc: describe,
            link: href,
            imgUrl: img,
            success: function() {
            },
            cancel: function() {
            }
          });

          wx.onMenuShareQZone({ //分享到qq空间
            title: tit,
            desc: describe,
            link: href,
            imgUrl: img,
            success: function() {
            },
            cancel: function() {
            }
          });
        });
      })
    }
  }
}
</script>