<template>
  <div class="invitePage">
    <preload></preload>
    <down :downLink='href' :linkedMe='linkedMe'></down>
    <share :actData='actData'></share>
    <pv :pv-data='pvData'></pv>
    <!-- <foot></foot> -->
    <buried></buried>

    <div class="content">
      <button @click='goDy'>点击发送公用动态</button>
      <button @click='goActDy'>点击发送活动动态</button>
      <button @click='goLayer'>点击弹窗</button>
    </div>
  </div>
</template>

<script>
import com from "./../util/common";

import foot from "./../components/footNotice";
import down from "./../components/down";
import preload from "./../components/preload";
import share from "./../components/shareInfo";
import pv from "./../components/pv";
import buried from "./../components/buriedPoint";

import mock from "mockjs";
export default {
  name: "inviteFriend",
  components: {
    foot,
    down,
    preload,
    share,
    pv,
    buried,
  },
  data() {
    return {
      json: {
        sess_token: com.$_GET("sess_token"),
        act_id: com.$_GET("id"),
        model_idfa: com.$_GET("model_idfa")
      },
      buriedJson: {
        access_occurred_type: 110102, //发生访问的【页面】类型
        access_occurred_type_id: com.$_GET("id"), //发生访问的【页面】类型ID
        previous_event_type_obj: "", //【事件】对象类型
        previous_event_type_obj_id: "", //【事件】对象类型ID
        previous_content_sort: "" //【事件】事件参数
      },
      actData: {
        sess_token: com.$_GET("sess_token"),
        act_id: com.$_GET("id"),
        model_idfa: com.$_GET("model_idfa"),
        link: ""
      },
      layerCall: false,
      linkedMe: null,
      pvData: null,
      href: "https://www.hxsapp.com/download",
      pvshow: true,
      layerblack: false,
      sendLayerData: null
    };
  },
  created() {
    this.actData = this.json;
    this.pvData = this.json;
  },
  mounted() {
    var _this = this;

    window.appShareCallback = function() {};

    window.hxsapp_visible_share_btn_mar = function() {
      com.newburiedPoint(_this.buriedJson);
    };

    this.$nextTick(() => {});
  },
  methods: {
    goDy() {
      var _this = this;
      let token = com.$_GET("sess_token");
      if (token && token.length < 10) {
        window.location.href = "https://hxsapp_showloginpage";
        return false;
      } else {
        window.location.href = "https://hxsapp_jump_dynamic#113";
      }
    },
    goActDy() {
      var _this = this;
      let token = com.$_GET("sess_token");
      if (token && token.length < 10) {
        window.location.href = "https://hxsapp_showloginpage";
        return false;
      } else {
        window.location.href =
          "https://hxsapp_newdynamic#" + "152" + "#" + "测试动态" + "#1";
      }
    },
    goLayer() {
      var _this = this
      _this.sendLayerData = {
        type: 1,　
        live: true,
        text: '<p>1. 分享活动给好友，好友完成下载，新用户需要输入好友的邀请码，注册成功后视为成功邀请；</p> <p>2. 每邀请一位好友即可获得一次抽取奖品机会。</p> <p>3. 每个手机号码仅限注册一次；</p> <p>4. 邀请越多，福利越大哦。</p></div>'
      }
      _this.layerCall = true
    }
  }
};
</script>

<style lang="less" scoped>
@import "./../assets/common/reset.less";

.content button {
  padding: 2rem;
  font-size: 0.5rem;
  background: -webkit-linear-gradient(150deg, #fa709a, #fee140);
  // background: linear-gradient(to top, #3f51b1 0%, #5a55ae 13%, #7b5fac 25%, #8f6aae 38%, #a86aa4 50%, #cc6b8e 62%, #f18271 75%, #f3a469 87%, #f7c978 100%);
  border: none;
  border-radius: 0.5rem;
  margin: 1rem auto;
}
</style>
