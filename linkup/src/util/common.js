
window.jquery = window.jQuery = window.$ = require('jquery');

import qqShare from './qqShare' //注意路径

import wx from 'weixin-js-sdk'


//判断是否测试环境
var _HOST = 'https://app.hxsapp.com';
var _ACTHOST = 'https://act.hxsapp.com';

var modelIdfa = $_GET('model_idfa');
var CallBack = '?callback=?' + '&model_idfa=' + modelIdfa;
export { _HOST, _ACTHOST };

function setCookie() {
  var sess_token = $_GET('sess_token');
  if (sess_token) {
    if ($.cookie('ci_session')) {
      $.removeCookie('ci_session', { path: '/' });
    }

    var date = new Date();
    date.setTime(date.getTime() + (86400 * 1000)); //sec秒
    $.cookie('ci_session', sess_token, { path: '/', expires: date });
  }
}
/**
 * [$_GET 从url取参数值]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
export function $_GET(key) {
  var p = window.location.href.split('?'),
    v = '';
  if (p.length < 2) {
    return false;
  }

  p = p[1].split('#');
  p = p[0].split('&');
  p.map(function (item) {
    var temp = item.split('=');
    if (temp[0] == key) {
      if (temp.length > 2) {
        for (var i in temp) {
          if (i > 0) {
            if (i > 1) {
              v += ('=' + temp[i]);
            } else {
              v += temp[i];
            }
          }
        }
      } else {
        v = temp[1];
      }
    }
  });
  return v;
}

//获取url参数
var locationSearch = window.location.href.split('?')[1];
export function getUrlParam(name, param = locationSearch) {
  if (!param) return null;
  var reg = new RegExp("(^|&)" + name + "=([^&]*)[(#|&|$)]");
  var r = param.match(reg);
  if (r != null) return unescape(r[2]);
  return null
}

//判断页面是否加载完毕
export function preLoading(id, fn) {

}

//判断好享瘦版本
export var UserAgent = window.navigator.userAgent;
export function myUserAgent(fn, state) {
  var hxsVersion = getHxsAppVersion()
  if (fn) {
    fn(hxsVersion);
  }
}
function moreMyUserAgent(fn, state) {
  var hxsVersion = getHxsAppVersion()
  if (fn) {
    fn(hxsVersion);
  }
}

export function getHxsAppVersion() {
  //获取版本号
  var UserAgent = window.navigator.userAgent;
  var windowLocation = window.location.href;
  var __version = UserAgent.split('hxsapp-version-')[1] ? UserAgent.split('hxsapp-version-')[1].split("&")[0] : "0.0.0";
  function __get_dian(str) {
    var num = 0;
    for (var i = 0; i < str.length; i++) {
      if (str[i] == ".") {
        num++;
      }
    }
    return num
  }

  //先补零操作
  //例如 2.10 ＝> 2.10.0
  //例如 2.10.1 不会补零操作

  if (__get_dian(__version) == 1) {
    __version = __version + ".0"
  }
  return __version

}

export function compareAppVersion(new_str, old_str) {

  //new_str > old_str
  // compareVersionEle("2.10.0","2.9.0") ture

  if (typeof new_str != "string" || typeof old_str != "string") {
    console.log("参数类型必须微字符串：string ")
    return;
  }
  if (new_str.indexOf(".") < 0 || old_str.indexOf(".") < 0) {
    console.log("版本号传入有错误")
    return;
  }

  function __get_dian(str) {
    var num = 0;
    for (var i = 0; i < str.length; i++) {
      if (str[i] == ".") {
        num++;
      }
    }
    return num
  }

  var __new_str = new_str;
  var __old_str = old_str;

  //先补零操作
  if (__get_dian(new_str) == 1) {
    __new_str = new_str + ".0"
  }
  if (__get_dian(old_str) == 1) {
    __old_str = old_str + ".0"
  }

  // debugger

  var new_str_split = __new_str.split(".");
  var old_str_split = __old_str.split(".");

  //比较第一位
  if (new_str_split[0] === old_str_split[0]) {

    //比较第二位
    if (new_str_split[1] === old_str_split[1]) {

      //比较第三位
      if (parseInt(new_str_split[2]) >= parseInt(old_str_split[2])) {
        return true
      } else if (parseInt(new_str_split[2]) < parseInt(old_str_split[2])) {
        return false
      }
    } else if (parseInt(new_str_split[1]) > parseInt(old_str_split[1])) {
      return true
    } else if (parseInt(new_str_split[1]) < parseInt(old_str_split[1])) {
      return false
    }

  } else if (parseInt(new_str_split[0]) > parseInt(old_str_split[0])) {
    return true
  } else if (parseInt(new_str_split[0]) < parseInt(old_str_split[0])) {
    return false
  }

}

export function toastTip(msg, time) {
  if (!msg) return;
  if (!time) { time = 1000 };
  var target = $('.toast_tip');
  var sliceLength = 16;
  var sliceRate = Math.ceil(msg.length / 16);
  if (msg.length > sliceLength) {
    var msg2 = '';
    for (var i = 0; i < sliceRate; i++) {
      msg2 += msg.slice(sliceLength * i, sliceLength * (i + 1)) + '<br>'
    }
    msg = msg2
  }
  target.html(msg);
  target.css({ 'left': '50%', 'marginLeft': -target.width() / 2 - 22 })
  target.show();
  setTimeout(function () {
    target.hide();
  }, time);
}

//下载链接
export var href = 'https://www.hxsapp.com/download';
// hxsDownload('.d_foot a');
export function hxsDownload(obj, shareImg, objpadding) {
  var ua = window.navigator.userAgent;
  var IsAndroid = new RegExp('Android').test(ua);
  var isAndroidQQ = new RegExp('Mobile MQQBrowser').test(ua);
  var MicroMessenger = new RegExp('MicroMessenger').test(ua);

  var isIos = new RegExp('iPhone').test(ua);
  var isIpad = new RegExp('iPad').test(ua);
  var isIosQQ = new RegExp(' QQ/').test(ua);
  if (isIos || isIpad) {
    $(obj).attr('href', 'https://at.umeng.com/5viObq');
  } else if (IsAndroid) {
    $(obj).attr('href', 'https://at.umeng.com/aCKnSD');
  }

  if ((IsAndroid && isAndroidQQ && !MicroMessenger) || (isIos && isIosQQ) || (isIpad && isIosQQ)) {
    $(obj).attr('href', 'https://www.hxsapp.com/download');
  }
  if ($(shareImg).length >= 1) {
    $.getJSON(_HOST + '/base/common/getAdListByType' + CallBack, { keywords: 'down_load_btn_ad' }, function (data) {
      var data = data.data[0];

      if (!data.image) {
        $(shareImg).hide();
        return false;
      }
      $(shareImg).css({
        width: parseInt(data.width) / 2,
        height: parseInt(data.height) / 2,
        background: 'url(' + data.image + ') left top no-repeat',
        'background-size': '100%',
        top: -parseInt(data.height) / 2
      });

      $(shareImg).click(function () {
        window.location.href = data.link;
      });
      $(objpadding).css('padding-bottom', 59 + parseInt(data.height) / 2);
    })
  }
}

//二次分享
export function wxSecShare(tit, describe, href, img) {
  // QQ二次分享
  qqShare.setShareInfo({
    title: tit,
    summary: describe,
    pic: img,
    url: href
  });

  // 微信二次分享
  $.getJSON(_HOST + '/base/common/getWxShareJsApiSignature?callback=?', { share_url: window.location.href }, function (data) {
    //console.log(data);
    wx.config({
      debug: false,
      appId: data.data.appId,
      timestamp: data.data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.data.noncestr, // 必填，生成签名的随机串
      signature: data.data.signature,// 必填，签名，见附录1
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
    });
    wx.ready(function () {
      wx.onMenuShareTimeline({ //微信分享到朋友圈
        title: tit,
        link: href,
        imgUrl: img,
        success: function () {
        },
        cancel: function () {
        }
      });

      wx.onMenuShareAppMessage({ //微信分享给朋友
        title: tit,
        desc: describe,
        link: href,
        imgUrl: img,
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
        },
        cancel: function () {
        }
      });

      wx.onMenuShareQQ({//分享到qq
        title: tit,
        desc: describe,
        link: href,
        imgUrl: img,
        success: function () {
        },
        cancel: function () {
        }
      });

      wx.onMenuShareWeibo({//分享到qq微博
        title: tit,
        desc: describe,
        link: href,
        imgUrl: img,
        success: function () {
        },
        cancel: function () {
        }
      });

      wx.onMenuShareQZone({ //分享到qq空间
        title: tit,
        desc: describe,
        link: href,
        imgUrl: img,
        success: function () {
        },
        cancel: function () {
        }
      });
    });
  })
}

//埋点统计
//ua参数获取
function getUaparen(key) {
  var p = window.navigator.userAgent;
  var v = '';
  p = p.split('&');
  p.map(function (item) {
    var temp = item.split('-');
    if (temp[0] == key) {
      if (temp.length > 2) {
        for (var i in temp) {
          if (i > 0) {
            if (i > 1) {
              v += ('-' + temp[i]);
            } else {
              v += temp[i];
            }
          }
        }
      } else {
        v = temp[1];
      }
    }
  });
  return v;
}

var newMobileSystem = getUaparen('mobile_system');
var newBrand = getUaparen('brand');
var newModel = getUaparen('model');
var newSystemResolution = getUaparen('system_resolution');
var newChannelNumber = getUaparen('channel_number');
var newVersionNumber = getUaparen('version_number');

var newNetworkEnvironment = getUaparen('network_environment');
var newLongitude = getUaparen('longitude');
var newLatitude = getUaparen('latitude');

var newRegisterId = getUaparen('register_id');
var newConversationId = getUaparen('conversation_id');
var newUserId = getUaparen('user_id');

export function newburiedPoint(json) {
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

export function buriedPoint(behavior, clickResults) {
  var webtype = '';
  moreMyUserAgent(function (Version) {
    var MicroMessenger2 = new RegExp('MicroMessenger').test(UserAgent);
    var type = MicroMessenger2 ? '微信' : '其他';
    if (Version) {
      webtype = 'APP内已设置类型';
    } else {
      webtype = type;
    }
  });

  var json = {
    'one_web': '/',
    'two_web': '/',
    'three_web': '/',
    'columned': '/',
    'behavior': behavior,
    'click_results': clickResults,
    'access_occurred_type': 'H5活动页面',
    'access_occurred_type_id': $_GET('id'),
    'statistical_type': '页面型',
    'previous_web_type': webtype,
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
    'user_id': newUserId
  }
  $.getJSON('https://mars.hxsapp.com/h5' + CallBack, json, function (data) { });
}

// 接入深度链接库linkedme框架

var linkedMe = function (__data = {}) {
  // debugger
  // 给默认值
  __data.domText = __data.domText ? __data.domText : "下载并打开APP";
  __data.domId = __data.domId ? __data.domId : "LinkedMeDom";

  var __linkedme_key = "69aff539eac106c3ef597454a7c319ed"

  var __type = (process.env.NODE_ENV === 'production') ? "live" : "test";
  linkedme.init(__linkedme_key, { type: __type }, null);

  // 处理传入进来的参数
  var data = Object.assign({}, __data);
  data.type = __type;  //表示现在使用线上模式,如果填写"test", 表示测试模式.【可选】
  // data.feature = "功能名称"; // 自定义深度链接功能，多个用逗号分隔，【可选】
  // data.stage = "阶段名称"; // 自定义深度链接阶段，多个用逗号分隔，【可选】
  data.channel = __data.params.channel; // 自定义深度链接渠道，多个用逗号分隔，【可选】
  // data.tags = "标签名称"; // 自定义深度链接标签，多个用逗号分隔，【可选】
  // data.ios_custom_url = ""; // 自定义iOS平台下App的下载地址，如果是AppStore的下载地址可以不用填写，【可选】
  // data.ios_direct_open = ""; //未安装情况下，设置为true为直接打开ios_custom_url，默认为false【可选】
  // data.android_custom_url = "";// 自定义安卓平台下App的下载地址，【可选】
  // data.android_direct_open = ""; //设置为true，所有情况下跳转android_custom_url，默认为false【可选】
  // 下面是自定义深度链接参数，用户点击深度链接打开app之后，params的参数会通过LinkedME服务器透传给app，由app根据参数进行相关跳转
  // 例如：详情页面的参数，写入到params中，这样在唤起app并获取参数后app根据参数跳转到详情页面
  // var value1 = 1;
  // var value2 = 2;

  // data.params = '{"key1":"'+value1+'","key2":"'+value2+'"}'; //注意单引号和双引号的位置
  data.params = '{"key":"' + data.params.key + '"}'; //注意单引号和双引号的位置

  // console.log("__data.params:" + JSON.stringify(__data.params))
  // console.log("__data.domText:" + __data.domText)
  // console.log("__data.domId:" + __data.domId)

  console.log(__data.params)

  // console.log("data.params:" + data.params)
  // debugger

  linkedme.link(data, function (err, response) {
    if (err) {
      // 生成深度链接失败，返回错误对象err
      return "error"
    } else {
      /*
        生成深度链接成功，深度链接可以通过data.url得到，
        将深度链接绑定到<a>标签，这样当用户点击这
        个深度链接，如果是在pc上，那么跳转到深度链接二维
        码页面，用户用手机扫描该二维码就会打开app；如果
        在移动端，深度链接直接会根据手机设备类型打开ios
        或者安卓app
        */
      console.log(response.url)
      document.getElementById(__data.domId).innerHTML = '<a class="linkedme" href="' + response.url + '">' + __data.domText + '</a>'

      document.getElementById(__data.domId).style.display = "block"

      // window.linkedme_url = response.url
      // debugger
      // return response.url
      // document.getElementById(domId).href = response.url;

    }
  }, false);

}

var h5CallAppAction = {
  hxsapp_visible_share_btn: function (obj) {
    var shareTitle = obj.shareTitle;
    var shareLink = obj.shareLink;
    var shareImages = obj.shareImages;
    var shareDescr = obj.shareDescr;
    var shareArticleId = obj.shareArticleId;
    var shareType = obj.shareType;
    var shareMediaLink = obj.shareMediaLink;
    var shareActWindowTitle = obj.shareActWindowTitle;
    var shareActWindowDescr = obj.shareActWindowDescr;

    var shareContent = [
      shareTitle,
      shareLink,
      shareImages,
      shareDescr,
      shareArticleId,
      shareType,
      shareMediaLink,
      shareActWindowTitle,
      shareActWindowDescr
    ].join("#");
    if (process.env.NODE_ENV === 'production' && isApp()) {
      window.location.href = 'https://hxsapp_visible_share_btn#' + shareContent;
    } else {
      console.log("本地开发pc环境，无法调起app分享协议")
    }

  },
  hxsapp_showloginpage: function () {
    window.location.href = "https://hxsapp_showloginpage";
  },
  hxsapp_addNubmerCar: function () {
    window.location.href = 'https://hxsapp_add_nubmer_car';
    if (process.env.NODE_ENV === 'production' && isApp()) {
      window.location.href = "https://hxsapp_showloginpage"
    } else {
      console.log("本地开发pc环境，无法调起app登录协议")
    }
  },
  hxsapp_new_webview: function (url) {
    console.log(url);
    if (process.env.NODE_ENV === 'production' && isApp()) {
      window.location.href = "https://hxsapp_new_webview#" + url
    } else {
      console.log("本地开发pc环境，无法开启新页面的app分享协议")
    }
  }
}
//判断是非在app里的方法
function isApp() {
  var is_sess_token;
  if (window.location.search.indexOf('sess_token') >= 0) {
    is_sess_token = true;
  } else {
    is_sess_token = false;
  }

  var shareMode;
  if (window.location.search.indexOf('shareType') >= 0) {
    shareMode = true;
  } else {
    shareMode = false;
  }

  // app下面的调试模式
  if ((window.location.search.indexOf('shareType') >= 0 && getUrlParam('shareType') == 1) || is_sess_token) {
    // console.log("在app里")
    return true
  } else {
    // console.log("不在app里")
    return false
  }

}

// 判断是否登录的方法
function isLogin() {

  var is_sess_token;
  // 坑：安卓下面app，没有登录的时候，sess_token＝null

  if (getUrlParam("sess_token") &&
    getUrlParam("sess_token").length != 0 &&
    getUrlParam("sess_token").length > 4
  ) {
    is_sess_token = true;
  } else {
    is_sess_token = false;
  }

  if (is_sess_token) {
    // console.log("在app里，且已经登录了")
    return true
  } else {
    // console.log("在app里，且没有登录了")
    return false
  }
}
function checklogin(hre) {
  let token = $_GET('sess_token');

  if (!isApp || $_GET('shareType') == 1) {
    toastTip('快来下载好享瘦参加活动吧！', 1500);
    setTimeout(function () {
      window.location.href = hre;
    }, 500)
    return false;
  } else if (token && token.length < 10) {
    window.location.href = 'https://hxsapp_showloginpage';
    return false;
  } else {
    return true
  }
}
var com = {
  $_GET,
  newburiedPoint,
  toastTip,
  getHxsAppVersion,
  checklogin,
  getUaparen,
  isApp,
  linkedMe
  // subStlength,
  // outSideShare,
  // buriedPoint,
  // iosInputfixed,
  // offEventIosInputFixed,
  // getHxsAppVersion,
  // compareAppVersion,
  // isApp,
  // isLogin,
  // // 全局配置的对象
  // config,
  // // h5调用app协议的封装业务方法对象
  // h5CallAppAction,
  // // app调用h5页面上函数执行的封装业务方法对象
  // appCallH5Action,
  // setTitle
}


export default com;