window.jquery = window.jQuery = window.$ = require('jquery');
import { $_GET, _HOST, _ACTHOST, _SHOST, UserAgent, href } from './common'
import { myUserAgent, wxSecShare, toastTip, buriedPoint, hxsDownload, getHsxAppVersion, compareAppVersion } from './common'

export function resizeWindow() {
    function e() {
        var e = document.documentElement.clientWidth,
            t = document.querySelector("html"),
            f = e / 25;
        window.fontSize = f;
        t.style.fontSize = f + "px";
    }
    e(), window.addEventListener("resize", e);
}

const UA = window.navigator.userAgent;
export var locationType = window.location.search.indexOf('sess_token');
export var globalJson = {
    sess_token: $_GET('sess_token'),
    act_id: $_GET('id'),
    model_idfa: $_GET('model_idfa')
}
export var json = {
    params: {
        act_id: $_GET('id'),
        sess_token: $_GET('sess_token'),
        model_idfa: $_GET('medel_idfa')
    }
}

// var downloadHref = 'https://www.hxsapp.com/download'
export function init(url) {
    if (UA.indexOf('iPhone') != -1 || UA.indexOf('iPad') != -1) {
        $('.copyright').html('※活动最终解释权归好享瘦APP所有 本活动与苹果公司无关');
    }
    if ($_GET('shareType') == 1) {
        var shareHtml = [];
        shareHtml += ['<div class="d_foot">',
            '<span class="colse"></span>',
            '<div class="d_foot_bg"></div>',
            '<div class="d_foot_main">',
            '<div class="left"></div>',
            '<div class="text">好享瘦,专业瘦</div>',
            '<a href="javascript:;">下载APP</a>',
            '</div>',
            '<div class="share-img"></div>',
            '</div>'].join('');
        if ($('.d_foot').css('display') != 'block') {
            $('body').append(shareHtml)
            $('.d_foot').show()
            hxsDownload('.d_foot a', '.share-img', '.dynamic-info-main-box');
            hxsDownload('.share-down .fn .confirm');
            // buriedPoint('站外活动H5', '站外活动H5');
        }
        $('.d_foot .colse').click(function () {
            $('.dynamic-info-main-box').css('padding-bottom', '0');
            $(this).parents('div').hide();
        })
    } else {
        $('.d_foot').hide();
        // buriedPoint('H5活动页面', 'H5活动页面');
    }

    $('.d_foot .colse').click(function () {
        $('.dynamic-info-main-box').css('padding-bottom', '0');
        $(this).parents('div').hide();
    })

    //下载链接处理
    var ua = window.navigator.userAgent;
    var IsAndroid = new RegExp('Android').test(ua);
    var isAndroidQQ = new RegExp('Mobile MQQBrowser').test(ua);
    var MicroMessenger = new RegExp('MicroMessenger').test(ua);
    var isIos = new RegExp('iPhone').test(ua);
    var isIpad = new RegExp('iPad').test(ua);
    var isIosQQ = new RegExp(' QQ/').test(ua);
    var downloadHref = ((IsAndroid && isAndroidQQ && !MicroMessenger) || (isIos && isIosQQ) || (isIpad && isIosQQ)) ? 'https://www.hxsapp.com/download' : url;
    $('.d_foot a').attr('href', downloadHref);

    if (UserAgent.indexOf('iPhone') != -1 || UserAgent.indexOf('iPad') != -1) {
        $('.notice').html('<p>活动最终解释权归好享瘦APP所有 </p><p>本活动与苹果公司无关</p>');
    } else if (UserAgent.indexOf('Android') != -1) {
        $('.notice').html('<p>活动最终解释权归好享瘦APP所有 </p>');
    }
}

export function getChannel(id) {
    var ua = window.navigator.userAgent;
    var IsAndroid = new RegExp('Android').test(ua);
    var isAndroidQQ = new RegExp('Mobile MQQBrowser').test(ua);
    var MicroMessenger = new RegExp('MicroMessenger').test(ua);

    var isIos = new RegExp('iPhone').test(ua);
    var isIpad = new RegExp('iPad').test(ua);
    var isIosQQ = new RegExp(' QQ/').test(ua);
    var head = 'http://app.hxsapp.com/html/channel_statistics.html?channel_id=' + id
    if ((IsAndroid && isAndroidQQ && !MicroMessenger) || (isIos && isIosQQ) || (isIpad && isIosQQ)) {
        head = 'https://www.hxsapp.com/download'
    }
    if (id == 'empty') {
        head = 'https://www.hxsapp.com/download'
    }
    $('.d_foot a').attr('href', head)
    return head
}

export function prevent() {
    $("body").on("touchmove", function (event) {
        event.preventDefault();
    }, false)
}

export function checklogin(hre) {
    var token = $_GET('sess_token');
    if ($_GET('shareType') == 1) {
        toastTip('.toast_tip', '快来下载好享瘦参加活动吧！', 2500);
        setTimeout(function () {
            window.location.href = hre;
        }, 500)
        return false;
    } else if (token && token.length < 10 || (locationType != -1 && !token)) {
        window.location.href = 'https://hxsapp_showloginpage';
        // myUserAgent(function (Version) {
        //     if (Version && (compareAppVersion(Version, "2.5.0") || Version == "2.5.0")) {
        //         window.location.href = 'https://hxsapp_showloginpage';
        //     }
        // })
        return false;
    }
}

//分享方法
export function shareFun(data, link) {
    //H5通知客户端显示分享按钮
    var shareLink = data.link + '&shareType=1&';
    // if (link) { shareLink = link + '&shareType=1&' }

    var share_url = { share_url: window.location.href };
    var shareTitle = data.title;
    var shareImages = data.share_pic;
    var shareDescr = data.descr;
    var shareType = data.share_type;
    var Version = getHsxAppVersion();

    //qq分享
    $('#qqShareContent').attr('content', decodeURIComponent(shareTitle));
    $('#qqShareDes').attr('content', '好享瘦APP  专享福利');
    $('#qqShareImg').attr('content', shareImages);
    //分享方法
    wxSecShare(shareTitle, shareDescr, shareLink, shareImages);

    if ((compareAppVersion(Version, "2.6.0")) && Version) {
        window.location.href = 'https://hxsapp_visible_act_share_btn#' + shareTitle + '#' + shareLink + '#' + shareImages + '#' + shareDescr + '#' + shareType;
    } else if ((compareAppVersion(Version, "2.2.0") || Version == "2.2.0") && (!(compareAppVersion(Version, "2.6.0") || Version == "2.6.0")) && Version) {
        window.location.href = 'https://hxsapp_visible_share_btn#' + shareTitle + '#' + shareLink + '#' + shareImages + '#' + shareDescr + '#' + shareType;
    } else if ((compareAppVersion(Version, "2.1.0") || Version == "2.1.0") && Version) {
        window.location.href = 'hxsapp://visible_share_btn|' + shareTitle + '|' + shareLink + '|' + shareImages + '|' + shareDescr + '|' + shareType;
    }
}