
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
  // document.onreadystatechange = function () {
  //   if (document.readyState == 'complete' || document.readyState == 'loaded') {
  //     finish(fn);
  //   }
  // }
  // function finish(fn) {
  //   setTimeout(function () {
  //     document.getElementById(id).style.display = 'none';
  //     if (fn) {
  //       fn();
  //     }
  //   }, 1000);
  // }

  // $('#' + id).on('touchstart', function () {
  //   return false;
  // });
}

//判断好享瘦版本
export var UserAgent = window.navigator.userAgent;
export function myUserAgent(fn, state) {
  var hxsVersion = getHsxAppVersion()
  if (fn) {
    fn(hxsVersion);
  }
}
function moreMyUserAgent(fn, state) {
  var hxsVersion = getHsxAppVersion()
  if (fn) {
    fn(hxsVersion);
  }
}

export function getHsxAppVersion() {
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

export function toastTip(obj, msg, time) {
  if (!msg) return;
  if (!time) { time = 1000 };
  var target = $(obj);
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
  var buriedPoint = json;
  var params = '';

  for (var key in buriedPoint) {
    params += key + '=' + buriedPoint[key] + '&';
  }

  params = params.substring(0, params.length - 1);
  var marsImg = new Image();
  marsImg.src = 'https://mars.hxsapp.com/h5?' + params;
}

export function buriedPoint(behavior, clickResults) {
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

  //判断在那个场景打开页面
  var MicroMessenger = new RegExp('MicroMessenger').test(ua);
  var previousWebType = MicroMessenger? '微信': '其他';
  if(isApp()) previousWebType = 'app内已设置类型';

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
    'conversation_id':newConversationId,
    'user_id': newUserId,
    'previous_web_type': previousWebType
  }
  var json = {
    access_occurred_type: 110102,//发生访问的【页面】类型
    access_occurred_type_id: $_GET('id'),//发生访问的【页面】类型ID
    previous_event_type_obj: '',//【事件】对象类型
    previous_event_type_obj_id: '',//【事件】对象类型ID
    previous_content_sort: ''//【事件】事件参数
  }
  var buriedPoint = Object.assign(json,uaPoint);
  var params = '';

  for (var key in buriedPoint) {
    params += key + '=' + buriedPoint[key] + '&';
  }
  params = params.substring(0, params.length - 1);

  var marsImg = new Image();
  marsImg.src = 'https://mars.hxsapp.com/h5?' + params;

  // var webtype = '';
  // moreMyUserAgent(function (Version) {
  //   var MicroMessenger2 = new RegExp('MicroMessenger').test(UserAgent);
  //   var type = MicroMessenger2 ? '微信' : '其他';
  //   if (Version) {
  //     webtype = 'APP内已设置类型';
  //   } else {
  //     webtype = type;
  //   }
  // });

  // var json = {
  //   'one_web': '/',
  //   'two_web': '/',
  //   'three_web': '/',
  //   'columned': '/',
  //   'behavior': behavior,
  //   'click_results': clickResults,
  //   'access_occurred_type': 'H5活动页面',
  //   'access_occurred_type_id': $_GET('id'),
  //   'statistical_type': '页面型',
  //   'previous_web_type': webtype,
  //   'mobile_system': newMobileSystem,
  //   'brand': newBrand,
  //   'model': newModel,
  //   'system_resolution': newSystemResolution,
  //   'channel_number': newChannelNumber,
  //   'version_number': newVersionNumber,
  //   'network_environment': newNetworkEnvironment,
  //   'longitude': newLongitude,
  //   'latitude': newLatitude,
  //   'register_id': newRegisterId,
  //   'conversation_id': newConversationId,
  //   'user_id': newUserId
  // }
  // $.getJSON('https://mars.hxsapp.com/h5' + CallBack, json, function (data) { });
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
