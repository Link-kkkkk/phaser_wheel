<template>

</template>

<script>
import com from './../util/common'
export default {
  name: 'buriedPoint',
  data() {
    return {
      json: {
        sess_token: com.$_GET('sess_token'),
        act_id: com.$_GET('id'),
        model_idfa: com.$_GET('model_idfa'),
      },
      buriedjson: {
        access_occurred_type: 110102,//发生访问的【页面】类型
        access_occurred_type_id: com.$_GET('id'),//发生访问的【页面】类型ID
        previous_event_type_obj: '',//【事件】对象类型
        previous_event_type_obj_id: '',//【事件】对象类型ID
        previous_content_sort: ''//【事件】事件参数
      },
      utime: com.$_GET('utime'),
      sign: com.$_GET('sign')
    }
  },
  mounted() {
    this.setRem()
    this.newburiedPoint()
  },
  methods: {
    setRem() {
      function e() {
        var e = document.documentElement.clientWidth,
          t = document.querySelector("html"),
          f = e / 25;
        window.fontSize = f;
        t.style.fontSize = f + "px";
      }
      e(), window.addEventListener("resize", e);
    },
    setBuried() {
      var _this = this
      this.newburiedPoint(this.buriedjson)
      window.hxsapp_visible_share_btn_mar = function() {
        _this.newburiedPoint(_this.buriedjson)
      }
    },
    newburiedPoint(jsons) {
      var ua = window.navigator.userAgent;
      //判断是非在app里的方法

      var newMobileSystem = com.getUaparen('mobile_system');
      var newBrand = com.getUaparen('brand');
      var newModel = com.getUaparen('model');
      var newSystemResolution = com.getUaparen('system_resolution');
      var newChannelNumber = com.getUaparen('channel_number');
      var newVersionNumber = com.getUaparen('version_number');
      var newNetworkEnvironment = com.getUaparen('network_environment');
      var newLongitude = com.getUaparen('longitude');
      var newLatitude = com.getUaparen('latitude');
      var newRegisterId = com.getUaparen('register_id');
      var newConversationId = com.getUaparen('conversation_id');
      var newUserId = com.getUaparen('user_id');

      //判断在那个场景打开页面
      var MicroMessenger = new RegExp('MicroMessenger').test(ua);
      var previousWebType = MicroMessenger ? '微信' : '其他';
      if (com.isApp()) previousWebType = 'app内已设置类型';

      var uaPoint = {
        'mobile_system': newMobileSystem,
        'brand': newBrand,
        'model': newModel,
        'system_resolution': newSystemResolution,
        'channel_number': newChannelNumber,
        'version_number': newVersionNumber,
        'network_environment': newNetworkEnvironment,
        'longitude': newLongitude,
        'latitude': newLatitude,
        'register_id': newRegisterId,
        'conversation_id': newConversationId,
        'user_id': newUserId,
        'previous_web_type': previousWebType
      }
      var json = {
        access_occurred_type: 110102,//发生访问的【页面】类型
        access_occurred_type_id: com.$_GET('id'),//发生访问的【页面】类型ID
        previous_event_type_obj: '',//【事件】对象类型
        previous_event_type_obj_id: '',//【事件】对象类型ID
        previous_content_sort: ''//【事件】事件参数
      }
      var buriedPoint = Object.assign(json, uaPoint);
      var params = '';

      for (var key in buriedPoint) {
        params += key + '=' + buriedPoint[key] + '&';
      }
      params = params.substring(0, params.length - 1);
      // console.log(params)
      var marsImg = new Image();
      marsImg.src = 'https://mars.hxsapp.com/h5?' + params;
    }
  }
}
</script>

<style>

</style>
