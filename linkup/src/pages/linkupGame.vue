<template>
  <div>
    <div class="warp" id="gameBox"></div>
    <preload></preload>
    <down :downLink='href' :linkedMe='linkedMe' v-if="onload"></down>
    <share :actData='actData' v-if="onload"></share>
    <pv :pv-data='pvData' v-if="onload"></pv>
    <foot></foot>
    <buried></buried>
  </div>
</template>
<script>
import Vue from "vue";

// phaser
window.PIXI = require('phaser-ce/build/custom/pixi.min');
window.p2 = require("phaser-ce/build/custom/p2.min");
window.Phaser = require("phaser-ce/build/custom/phaser-split");

var rootUrl;
var headUrl;
var giftUrl;
if (process.env.NODE_ENV === "production") {
  rootUrl = "https://app.hxsapp.com/actweb/linkup/static/source/linkup/";
  headUrl = "https://app.hxsapp.com/actweb/linkup/static/source/linkup/head/";
  giftUrl = "https://app.hxsapp.com/actweb/linkup/static/source/linkup/gift/";
} else {
  rootUrl = "./static/source/linkup/";
  headUrl = "./static/source/linkup/head/";
  giftUrl = "./static/source/linkup/gift/";
}

// 引擎初始化
function gameEngine(vue, vueData) {
  var game = new Phaser.Game(750, 1200, Phaser.CANVAS, "gameBox");
  var clientH = document.documentElement.clientHeight;
  // 舞台对象
  game.States = {};
  var _vue = vue;
  var _vuedata = vueData;
  var _gameStateBoot = game.States.boot;
  var _gameStatePre = game.States.preload;
  
  var bgMusic; // 全局背景音乐
  var bgMusicStop = false
  game.States.boot = function() {
    //状态初始化
    this.preload = function() {
      if (typeof GAME !== "undefined") {
        this.load.baseURL = GAME + "/";
      }
      if (!game.device.desktop) {
        // //非桌面模式刷新大小
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.forcePortrait = true;
        this.scale.refresh();
      }

      //第一幕预加载画面的资源在这里优先加载
      game.load.image("loadBg", rootUrl + "bg.jpg");
      game.load.image("loadLine", rootUrl + "loadingLine.png");
      game.load.image("loadLineIn", rootUrl + "loadline.png");
    };
    this.create = function() {
      //预加载
      game.state.start("preload");
    };
  };

  game.States.preload = function(game) {
    this.init = function() {};

    this.preload = function() {
      game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
      // 资源加载 (预加载画面以外的资源在这里加载)
      game.load.audio("bgSound", rootUrl + "bg.mp3");
      
      //第二幕
      game.load.image("startTitle", rootUrl + "startTitle.png");
      game.load.image("startupbg", rootUrl + "bg_start.jpg");
      game.load.image("startBtn", rootUrl + "startBtn.png");
      game.load.image("ruleBtn", rootUrl + "ruleBtn.png");
      game.load.image("gorankText", rootUrl + "gorankText.png");
      game.load.image("musicBtn", rootUrl + "btn_audio.png");
      game.load.image("ruleBox", rootUrl + "ruleLayer.png");
      game.load.image("close_2", rootUrl + "close_3.png");
      game.load.image("outBox", rootUrl + "outBox.png");
      
      game.load.spritesheet("snowflakes", rootUrl + "snowflakes.png", 17, 17);
      game.load.spritesheet("snowflakes_large",rootUrl + "snowflakes_large.png",64,64);

      //第三幕
      for (var i = 1; i < 13; i++) {
        game.load.image("ani_" + i, headUrl + "sprite_" + i + ".png");
      }
      game.load.spritesheet('balls', rootUrl + 'balls.png', 17, 17)
      game.load.image("gameBg", rootUrl + "gameBg.jpg");
      game.load.image("gameTitle", rootUrl + "game_title.png");
      game.load.image("gamePoint", rootUrl + "gamePoint.png");
      game.load.image("winBox", rootUrl + "layer_win.png");
      game.load.image("close", rootUrl + "close.png");
      game.load.image("again", rootUrl + "btn_1.png");
      game.load.image("continue", rootUrl + "btn_5.png");
      game.load.image("headmask", rootUrl + "headMask.png");
      game.load.image("nextBtn", rootUrl + "btn_7.png")
      //请求头像
      _vue.$http.jsonp(
        _vue.$common.common._ACTHOST + "/eliminateMusic/Mod/getUserHeadImg",
        { params: _vue.json }
      )
      .then(function(data) {
        if (data.data.code == 200) {
          game.load.image("head", data.data.data.head_img);
        } else {
          game.load.image("head", rootUrl + "head.png");
        }
      });

      // 奖品
      var giftRan = Math.floor(Math.random() * 4)
      game.load.image("giftBga", giftUrl + "gift_" + giftRan + ".png");
      game.load.image("giftBgh", giftUrl + "gifta_" + giftRan + ".png");
      game.load.image("headmask", rootUrl + "headMask.png");

      //加载条
      var worldW = document.body.clientWidth;
      var worldH = document.body.clientHeight;
      game.world.setBounds(0, 0, game.width, game.height);
      // var loadbgWidth = game.cache.getImage('loadBg').width;
      // var loadbgHeight = game.cache.getImage('loadBg').height;
      var loadBg;
      loadBg = game.add.image(0, 0, "loadBg");
      loadBg.anchor.set(0);
      loadBg.width = game.world.width;
      loadBg.height = game.world.height;

      var loadText, loadTextStyle;
      var loadLine, loadCompleteLine, loadCompleteLineStyle;
      loadTextStyle = {
        fill: "#f4d4ff",
        fontSize: "24px",
        fontWeight: "200"
      };
      loadText = game.add.text(
        game.world.centerX,
        615,
        "圣诞仙礼消消乐 游戏正在加载中...",
        loadTextStyle
      );
      loadText.anchor.setTo(0.5);
      loadLine = game.add.image(game.world.centerX, 530, "loadLine");
      loadLine.anchor.setTo(0.5);
      var loadLineH = game.cache.getImage("loadLine").height;

      loadCompleteLine = game.add.image(188, 505, "loadLineIn");
      loadCompleteLine.width = 10;
      var loadCompleteLineLong = game.cache.getImage("loadLineIn").width;

      var progress = 0;
      // var timer = setInterval(function() {
      //   progress++
      //   if (progress >= 100) {
      //     clearInterval(timer)
      //     game.state.start('startup');
      //   }
      //   loadCompleteLine.width = 370 * (progress / 100)
      // }, 10)

      game.load.onFileComplete.add(function(progress) {
        loadCompleteLine.width = 370 * (progress / 100);
        if (progress == "100") {
          game.state.start("startup");
        }
      });
    };

    this.create = function() {};
  };

  game.States.startup = function(game) {
    var ruleGroup;
    var outGroup;
    var front_emitter,mid_emitter,back_emitter;
    var update_interval = 6 * 60;
    var snowMax = 0;
    var timecount = 0;
    var toasted = false;
    var ruleed = false;
    var _this = this;
    this.init = function() {};

    this.preload = function() {
      game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    };

    this.create = function() {
      // var _this = this;
      var worldW = document.body.clientWidth;
      var worldH = document.body.clientHeight;
      var startupBg, startTitle, startTitleAni;
      startupBg = game.add.image(0, 0, "startupbg");
      startupBg.width = game.world.width;
      startupBg.height = game.world.height;
      startTitle = game.add.image(94, 120, "startTitle");
      // startTitle.anchor.set(0.5);
      startTitleAni = game.add.tween(startTitle);
      startTitleAni.from(
        { x: game.world.centerX, width: 0, height: 0 },
        3000,
        Phaser.Easing.Bounce.Out,
        true
      );

      game.world.setBounds(0, 0, game.width, game.height);

      //开始游戏
      var startBtn;
      startBtn = game.add.button(game.world.centerX,1070,"startBtn",function() {
        goMain();
      },game,0,0,3,0);
      startBtn.anchor.setTo(0.5);

      var gorankStyle = {
        font:'24px pingfangSC',
        fill:'#4c4e52',
        textDecoration: '1px'
      }
      var gorank = game.add.button(game.world.centerX,1125,'gorankText',gorankClick,this,null,null,null,null);
      gorank.anchor.setTo(0.5);
      function gorankClick() {
        if (process.env.NODE_ENV != "production") {
          _this.nuclear()
          _vue.$router.push({
            name: "linkupRank",
            params: {
              data: _vuedata,
              // gameData: sendData,
              from: 'home',
              type: 'rank'
            },
          });
        }

        if (com.checklogin(_vue.href) == false) {
          return false;
        }

        if (!com.$_GET('sess_token') || com.$_GET('sess_token').length < 10){
          com.toastTip('登陆才能游玩哦',1500)
          return false;
        }

        _this.nuclear()
        _vue.$router.push({
          name: "linkupRank",
          params: {
            data: _vuedata,
            // gameData: sendData,
            from: 'home',
            type: 'rank'
          },
        });
      }

      if(!bgMusic){
        bgMusic = game.add.audio("bgSound",'1',0.5);
        bgMusic.loop = true
        bgMusic.autoplay = true 
        bgMusic.play();
      }

      snowing()
      function snowing() {
        back_emitter = game.add.emitter(game.world.centerX, -32, 600);
        back_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
        back_emitter.maxParticleScale = 0.6;
        back_emitter.minParticleScale = 0.2;
        back_emitter.setYSpeed(20, 100);
        back_emitter.gravity = 0;
        back_emitter.width = game.world.width * 2;
        back_emitter.minRotation = 0;
        back_emitter.maxRotation = 40;

        mid_emitter = game.add.emitter(game.world.centerX, -32, 500);
        mid_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
        mid_emitter.maxParticleScale = 1.2;
        mid_emitter.minParticleScale = 0.8;
        mid_emitter.setYSpeed(50, 150);
        mid_emitter.gravity = 0;
        mid_emitter.width = game.world.width * 2;
        mid_emitter.minRotation = 0;
        mid_emitter.maxRotation = 40;

        front_emitter = game.add.emitter(game.world.centerX, -32, 50);
        front_emitter.makeParticles('snowflakes_large', [0, 1, 2, 3, 4, 5]);
        front_emitter.maxParticleScale = 1;
        front_emitter.minParticleScale = 0.5;
        front_emitter.setYSpeed(100, 200);
        front_emitter.gravity = 20;
        front_emitter.width = game.world.width * 2;
        front_emitter.minRotation = 0;
        front_emitter.maxRotation = 40;

        _this.changeWindDirection();

        back_emitter.start(false, 14000, 20);
        mid_emitter.start(false, 12000, 40);
        front_emitter.start(false, 6000, 1000);

        function setXSpeed(emitter, max){
          emitter.setXSpeed(max - 20, max);
          emitter.forEachAlive(setParticleXSpeed, this, max);
        }

        function setParticleXSpeed(particle, max){
          particle.body.velocity.x = max - Math.floor(Math.random() * 30);
        }
      }

      function goMain() {
        //游戏状态监测
        var token = com.$_GET("sess_token");
        var locationType = window.location.search.indexOf("sess_token");
        if (process.env.NODE_ENV != "production") {
          $(".noticeWarp,.pv").hide();
          game.state.start("main");
          return;
        }

        if (com.checklogin(_vue.href) == false) {
          return false;
        }
        _vue.$http.jsonp(
            "https://act.hxsapp.com/game/ChristmasEliminate/getGameTimes",
            { params: _vue.json }
          )
          .then(function(data) {
            if (data.data.code == 200) {
              $(".noticeWarp,.pv").hide();
              game.state.start("main");
            } else if(data.data.code == 614){
              _this.showOut()
            } else if(data.data.code == 401){
              window.location.href = 'https://hxsapp_showloginpage';
            } else {
              com.toastTip(data.data.msg, 1500);
            }
          });
      }

      var ruleBtn;
      ruleBtn = game.add.button(594,36,"ruleBtn",function() {
          _this.showRule();
        },game,0,0,3,0
      );

      var musicBtn;
      musicBtn = game.add.button(70,56,"musicBtn",function() {
          musicClick();
        },game,0,0,3,0
      );
      musicBtn.anchor.set(.5);
      var musicBtnTween = game.add.tween(musicBtn)
      // musicBtnTween.from({ y: -500 }, 500, Phaser.Easing.Bounce.Out, true)
      musicBtnTween.to({ angle: 360 },2000, Phaser.Easing.Linear.None, true).loop()

      function musicClick(){
        if(bgMusic.isPlaying){
          bgMusic.pause()
          // bgMusicPausedPosition = bgMusic.pausedPosition
          musicBtnTween.isPaused = true
          bgMusicStop = true
        }else{
          bgMusic.resume()
          musicBtnTween.isPaused = false
          bgMusicStop = false
        }
      }
    };

    this.update = function() {
      timecount++;
      if (timecount === update_interval){
        _this.changeWindDirection();
        update_interval = Math.floor(Math.random() * 100) * 60; // 0 - 100sec @ 60fps
        timecount = 0;
      }
    };

    this.showRule = function() {
      if(ruleed){
        return
      }
      ruleed = true
      this.ruleGroup = game.add.group();
      var ruleBox = this.ruleGroup.create(game.world.centerX, 550, "ruleBox");
      ruleBox.anchor.set(0.5);
      this.ruleGroup.addChild(ruleBox);

      var ruleAni = game.add.tween(ruleBox);
      ruleAni.from({ y: game.world.centerY + 800, },800,Phaser.Easing.Bounce.Out,true);

      var closeBtn = game.add.button(620,220,"close_2",closeLayer,this,null,null,null,null,
        this.ruleGroup
      );
      closeBtn.scale.setTo(1.5);
      var btnAni = game.add.tween(closeBtn);
      btnAni.from({ y: game.world.centerY + 800, },800,Phaser.Easing.Bounce.Out,true);

      function closeLayer() {
        var leftAni = game.add.tween(ruleBox);
        leftAni.to({ y: game.world.centerY + 800, },500,Phaser.Easing.Linear.None,true);
        var leftAni_2 = game.add.tween(closeBtn);
        leftAni_2.to({ width:0,height:0,angle: 360 },200,Phaser.Easing.Linear.None,true)

        setTimeout(() => {
          ruleed = false
          this.ruleGroup.destroy();
        },500)
      }
    };

    this.showOut = function() {
      if(toasted){
        return
      }
      toasted = true
      this.outGroup = game.add.group();
      var outBox = this.outGroup.create(game.world.centerX, 550, "outBox");
      outBox.anchor.set(0.5);
      this.outGroup.addChild(outBox);

      var outAni = game.add.tween(outBox);
      outAni.from({ y: game.world.centerY - 800, },800,Phaser.Easing.Bounce.Out,true);

      var closeBtn = game.add.button(game.world.centerX - 59/2,850,"close",closeLayer,this,null,null,null,null,
        this.ruleGroup
      );
      var closeBtnAni = game.add.tween(closeBtn);
      closeBtnAni.from({ alpha: 0, },800,Phaser.Easing.Linear.None,true);

      function closeLayer() {
        var leftAni = game.add.tween(outBox);
        leftAni.to({ y: game.world.centerY + 800, },500,Phaser.Easing.Linear.None,true);
        var leftAni_2 = game.add.tween(closeBtn);
        leftAni_2.to({ width:0,height:0,angle: 360 },200,Phaser.Easing.Linear.None,true)

        setTimeout(() => {
          toasted = false
          this.outGroup.destroy();
        },500)
      }
    }

    this.changeWindDirection = function(){
      //随机速度
      var multi = Math.floor((snowMax + 200) / 4),
      frag = (Math.floor(Math.random() * 100) - multi);
      snowMax = snowMax + frag;
      if (snowMax > 120) snowMax = 100;
      if (snowMax < -120) snowMax = -100;
      //给所有雪花改变速度
      _this.setXSpeed(back_emitter, snowMax);
      _this.setXSpeed(mid_emitter, snowMax);
      _this.setXSpeed(front_emitter, snowMax);
    }

    this.setXSpeed = function(emitter, max){
      emitter.setXSpeed(max - 20, max);
      emitter.forEachAlive(_this.setParticleXSpeed, this, max);
    }

    this.setParticleXSpeed = function(particle, max){
      particle.body.velocity.x = max - Math.floor(Math.random() * 30);
    }

    this.nuclear = function () {
      game.destroy();
    } 
  };

  game.States.main = function(game) {
    var _this = this;
    // 交互参数
    var lockNum = 0;
    var iconArr = [];
    var newIcon, newIconGroup;
    var newIconArr = [],
      newIconArrLeft = [],
      newIconArrTop = [];
    //补间动画
    var lockTween, boomTween;
    // var bgMusic;
    //弹窗
    var loseLayer;
    //游戏地图
    var map_1 = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];
    //游戏分数
    var point = 0;
    var pointText = '';
    var sendPoint = 0;
    var winPoint = 10;
    var stage = 1;
    var stage_1_time = 10;
    var stage_2_time = 10;
    //游戏时间
    var mianTimer;
    var timeCount = 0;
    //流程工具
    var gameStop = false;
    var gameEnd = false;
    this.preload = function() {
      game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    };
    // UI
    var tapIcon, iconGroup, iconBtnGroup;
    var tapIconAnimate;
    var outimgArr = [];
    for (var i = 1; i < 13; i++) {
      outimgArr.push("ani_" + i);
    }
    var gameBg;
    var giftBg,giftBgh,giftBga;
    var giftBgBtn;
    this.create = function() {
      // this.endGame()
      var worldW = document.body.clientWidth;
      var worldH = document.body.clientHeight;
      var re = worldW / 25;
      game.world.setBounds(0, 0, game.width, game.height);
      
      game.physics.startSystem(Phaser.Physics.ARCADE);

      //装载背景音乐
      // if (!bgMusicStop && stage == 1) {
      //   bgMusic = game.add.sound("bgSound");
      //   bgMusic.autoplay = true;
      //   bgMusic.loop = true;
      //   bgMusic.play();
      // }
      console.log(!bgMusic)
      //渲染
      this.createBg();
      this.createTitle();
      // this.UIrender();
      this.gamePoint(0);
      this.createIcon();
      if (stage == 1) {
        this.clockTimer(stage_1_time);
      } else {
        this.clockTimer(stage_2_time);
      }
    };
    this.update = function() {
      if (timeCount <= 0) {
        if (gameStop) {
          return false;
        }
        this.winCheck();
      }
    };
    this.render = function() {};
    this.gamePoint = function(point) {
      if (gameStop) {
        return;
      }

      pointText.setText(point);

      function gamePointLine(){
        var pointLine = game.add.image(298, 28, "gamePoint");
        var pointLong = point;
        if (stage == 1) {
          if (pointLong > 100) {
            pointLong = 100;
          }
          pointLine.width = pointLong * 2.4;
        } else if (stage == 2) {
          if (pointLong > 60) {
            pointLong = 60;
          }
          pointLine.width = pointLong * 4;
        }
      }
    };

    // 生成图标
    this.createIcon = function(type) {
      // var _this = this
      if(type === 'destory'){
        iconGroup.kill();
        iconBtnGroup.kill();
        newIconGroup.kill();
        return
      }

      game.physics.startSystem(Phaser.Physics.ARCADE);
      //循环生成游戏图标
      iconGroup = game.add.group();
      iconBtnGroup = game.add.group();
      newIconGroup = game.add.group();

      iconGroup.enableBody = true;
      // iconGroup.physicsBodyType = Phaser.Physics.ARCADE;
      iconBtnGroup.enableBody = true;
      // iconBtnGroup.physicsBodyType = Phaser.Physics.ARCADE;
      newIconGroup.enableBody = true;
      // newIconGroup.physicsBodyType = Phaser.Physics.ARCADE;
      for (var i = 0; i < map_1.length; i++) {
        for (var j = 0; j < map_1[i].length; j++) {
          var randomOuter = _this.random(12);
          var outimg = outimgArr[randomOuter];

          tapIcon = iconGroup.create(145 + 116 * j, 350 + 116 * i, outimg);
          tapIcon.width = 100;
          tapIcon.height = 100;
          tapIcon.anchor.setTo(0.5);
          tapIconAnimate = tapIcon.animations.add("play");
          tapIconAnimate.play(15, true);

          // tapIcon.collideWorldBounds = true
          // tapIcon.body.bounce.y = 0;
          // tapIcon.body.velocity.set(0, 200);
          tapIcon.body.moves = false;

          tapIcon.inputEnabled = true;
          tapIcon.events.onInputUp.add(_this.lock);
          game.physics.arcade.collide(iconGroup);
        }
      }

      iconGroup.setAll("body.collideWorldBounds", true);
      newIconGroup.setAll("body.collideWorldBounds", true);
    };

    this.createBg = function(type){
      if(type === 'destory'){
        gameBg.kill()
        return
      }

      gameBg = game.add.image(0, 0, "gameBg");
      gameBg.anchor.set(0);
      gameBg.width = game.world.width;
      gameBg.height = game.world.height;

    }

    this.createGiftBg = function(type){
      // giftBg.kill()
      if(type == 1){
        giftBg = game.add.image(0, 0, "giftBgh");
        giftBg.anchor.set(0);
        giftBg.width = game.world.width;
        giftBg.height = game.world.height;
        var bgAni = game.add.tween(giftBg);
        bgAni.from({ alpha: 0, },1000,Phaser.Easing.Linear.None,true);

        giftBgBtn = game.add.button(game.world.centerX,1075,"nextBtn",nextStage,game,0,0,3,0)
        giftBgBtn.anchor.setTo(0.5);
        
        _this.createTitle();

        function nextStage() {
          //初始化数据
          gameStop = false;
          sendPoint += point;
          point = 0;
          winPoint = 0;
          game.state.start("main");
        }
      }else{
        giftBg.kill()
        giftBg = game.add.image(0, 0, "giftBga");
        giftBg.anchor.set(0);
        giftBg.width = game.world.width;
        giftBg.height = game.world.height;
        var bgAni = game.add.tween(giftBg);
        bgAni.from({ alpha: 0, },1000,Phaser.Easing.Linear.None,true);

        _this.createTitle();
      }
    }

    this.createTitle = function(type){
      var gameTitle;
      gameTitle = game.add.image(31, 0, "gameTitle");

      var text = point 
      var pointTextStyle = {
        font: "26px PingFang SC",
        fill: "#FFF"
      };
      pointText = game.add.text(295, 24, text, pointTextStyle);

      _this.UIrender()

      if(type === 'destory'){
        gameTitle.kill()
        pointText.kill()
      }
    }

    // 点击
    this.lock = function(item) {
      if (gameStop) {
        return;
      }
      iconArr.push(item);
      lockNum++;
      newIconArrLeft.push(item.left);
      newIconArrTop.push(item.top);
      _this.rolling(iconArr[0], lockNum);

      if (lockNum >= 2) {
        for (var i = 0; i < iconArr.length; i++) {
          if (iconArr[i].z === iconArr[i + 1].z) {
            reback(i);
          } else if (iconArr[i].key === iconArr[i + 1].key) {
            _this.killing(iconArr[i], _this, i);
            _this.killing(iconArr[i + 1], _this, i + 1);
            iconArr = [];
            newIconArrLeft = [];
            newIconArrTop = [];
          } else {
            reback(i);
          }
        }
        lockNum = 0;
      }

      function reback(i) {
        iconArr[i].alpha = 1;
        iconArr[i + 1].alpha = 1;
        iconArr = [];
        newIconArrLeft = [];
        newIconArrTop = [];
        lockNum = 0;
      }
    };

    // 重新生成
    this.refreash = function(left, top) {
      var outimgArr = [];
      for (var i = 1; i < 13; i++) {
        outimgArr.push("ani_" + i);
      }
      var randomOuter = _this.random(12);
      var outimg = outimgArr[randomOuter];
      newIcon = newIconGroup.create(left + 50, top + 50, outimg);
      newIcon.width = 100;
      newIcon.height = 100;
      newIcon.anchor.setTo(0.5);
      var newIconAnimate = newIcon.animations.add("play");
      newIconAnimate.play(15, true);

      newIcon.body.moves = false;

      newIcon.inputEnabled = true;
      newIcon.events.onInputUp.add(_this.lock);
    };

    // 其他UI
    this.UIrender = function() {
      var stageNum = "第" + stage + "关";
      var stageTextStyle = {
        font: "26px PingFang SC",
        fill: "#FFF"
      };
      var stageText = game.add.text(605, 22, stageNum, stageTextStyle);
      // var headimg = game.add.image(66, 25, 'head')
      // // headimg.anchor.setTo(.5)
      // headimg.width = 137
      // headimg.height = 137
      // headimg.radius = 50

      // 蒙版写圆...暂时无解只能这样
      var bmd = game.make.bitmapData(206, 206);
      bmd.alphaMask("head","headmask",{x: -4,y: 0,width: 150,height: 150},
      {x: 0,y: 0,width: 142,height: 142});
      game.add.image(63, 25, bmd);
    };

    // 时间
    this.clockTimer = function(time) {
      var clockTextStyle = {
        font: "76px pingfangSC",
        fontWeight: "bold",
        fill: "#ffe72e"
      };
      timeCount = time;
      var clockText = game.add.text(
        game.world.centerX + 10,
        130,
        timeCount,
        clockTextStyle
      );
      clockText.anchor.setTo(0.5);

      function clockInter() {
        timeCount--;
        clockText.setText(timeCount);
      }

      // 挂载主定时器
      mianTimer = game.time.events.loop(Phaser.Timer.SECOND, clockInter, this);
    };

    // 流程控制
    this.winCheck = function() {
      game.time.reset();
      gameStop = true;

      if (stage > 1) {
        winPoint = 0;
      }

      if (point >= winPoint) {
        if (stage == 1) {
          stage++;
          this.imgFade()
          this.createGiftBg(1)
        } else {
          this.imgFade()
          this.createGiftBg(2)
          setTimeout(() => {
            sendPoint += point;
            var sendData = {
              win: true,
              point: sendPoint
            };
            this.endGame(sendData);
          },3000)
        }
      } else {
        sendPoint += point;
        var sendData = {
          win: false,
          point: sendPoint
        };
        this.endGame(sendData);
      }
    };

    this.endGame = function(sendData) {
      // 移除定时器，干掉引擎
      this.gameEnd = true;
      bgMusic.stop();
      _this.nuclear()
      // debugger
      // _vue.$parent.$data.json.gamePoint = sendData.point;
      // _vue.$parent.$data.json.shareType = false;

      _vue.$router.push({
        name: "linkupRank",
        params: {
          data: _vuedata,
          gameData: sendData,
          from: 'end',
          type:'check'
        }
      });
    };
    this.nuclear = function () {
      game.destroy();
    } 
    // 补间动画
    // 消除头像
    this.killing = function(obj, parent, index) {
      var _obj = obj;
      var left = newIconArrLeft[index];
      var top = newIconArrTop[index];
      var killTween, killTween2;
      var emitter = game.add.emitter(left + 116/2, top + 116/2, 10);

      emitter.makeParticles('balls', [0, 1, 2, 3, 4, 5]);
      emitter.gravity = 400;
      emitter.autoAlpha = true;
      emitter.setAlpha(.8, 0);
      emitter.setXSpeed(-200, 200);
      emitter.setYSpeed(-200, 200);
      emitter.start(false, 500, 15);

      setTimeout(()=>{
        emitter.removeAll(true);
        emitter.kill();
      },500)

      killTween = game.add
        .tween(obj)
        .to(
          { width: 0, height: 0, alpha: 0 },
          500,
          Phaser.Easing.Bounce.Out,
          true
        );
        
      killTween.onComplete.add(tweenEnd, this);
      
      function tweenEnd() {
        _obj.kill();
        parent.refreash(left, top);
        point += 5;
        _this.gamePoint(point);
      }
    };
    this.imgFade = function(num){
      _this.createBg('destory')
      _this.createIcon('destory')
    }
    // 弹窗
    this.loseToast = function(type) {
      callBox()
      function callBox() {
        loseLayer = game.add.group();
        //蒙版
        var graphics = game.add.graphics(0, 0);
        loseLayer.addChild(graphics);
        //直接给画板alpha会造成同层其他元素也透明
        //graphics.alpha = .75;
        graphics.beginFill("0x000000", 0.75);
        graphics.drawRect(0, 0, game.camera.width, game.camera.height);
        graphics.endFill();
        graphics.z = 5;

        if (type == 0) {
          var loseBox = loseLayer.create(game.world.centerX, 500, "winBox");
          loseBox.anchor.set(0.5);
          loseLayer.addChild(loseBox);

          var pointStyle = {
            font: "48px pingfangSC",
            fontWeight: "bold",
            fill: "#FFF"
          };
          var pointEndText = game.add.text(
            game.world.centerX + 55,
            390,
            point,
            pointStyle
          );
          pointEndText.anchor.setTo(0.5);
          loseLayer.addChild(pointEndText);

          var continueBtn = game.add.button(game.world.centerX,680,"continue",nextStage,this,null,null,null,null,loseLayer);
          continueBtn.anchor.set(0.5);

          var closeBtn = game.add.button(game.world.centerX,900,"close",nextStage,this,null,null,null,null,loseLayer);
          closeBtn.anchor.set(0.5);
        } else if (type == 1) {
        }

        var arr = [loseBox,pointEndText,continueBtn,closeBtn]
        for(var i = 0; i < arr.length; i++){
          var loseTween = game.add.tween(arr[i]);
          loseTween.from({ y: -500 }, 500, Phaser.Easing.Bounce.Out, true);
        }
      }
      function closeLayer() {
        //其实一个元素只能进入一个组
        loseLayer.destroy();
      }
      function nextStage() {
        //初始化数据
        gameStop = false;
        sendPoint += point;
        point = 0;
        winPoint = 60;
        game.state.start("main");
      }
    };
    //旋转对象
    this.rolling = function(obj, locknum) {
      if (!locknum) {
        locknum == 1;
      }
      if (lockNum == 1) {
        lockTween = game.add
          .tween(obj)
          .to({ angle: 360 },2000,Phaser.Easing.Linear.None,true,0,1000,false)
          .start();
      } else {
        lockTween.pause();
        lockTween = game.add
          .tween(obj)
          .to({ angle: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false)
          .start();
      }
    };
    this.boom = function(obj) {
      boomTween = game.add
        .tween(obj)
        .to({ angle: 360 },2000,Phaser.Easing.Linear.None,true,0,1000,false)
        .start();
    };
    this.random = function(num) {
      var randomNum = Math.floor(Math.random() * num);
      return randomNum;
    };
  };

  //舞台配置
  game.state.add("boot", game.States.boot);
  game.state.add("startup", game.States.startup);
  game.state.add("preload", game.States.preload);
  game.state.add("main", game.States.main);

  //主线程启动
  game.state.start("boot");
}

import com from "./../util/common";

import foot from "./../components/footNotice";
import down from "./../components/down";
import preload from "./../components/preload";
import share from "./../components/shareInfo";
import pv from "./../components/pv";
import buried from "./../components/buriedPoint";

export default {
  name: "linkupGame",
  components: {
    foot,
    down,
    preload,
    share,
    pv,
    buried
  },
  data() {
    return {
      json: {
        sess_token: com.$_GET("sess_token"),
        act_id: com.$_GET("id"),
        model_idfa: com.$_GET("model_idfa"),
        shareType: false,
        gamePoint: null
      },
      href: "https://www.hxsapp.com/download",
      resetData: null,
      act_id: "",
      actData: null,
      linkedMe: null,
      pvData: null,
      pvshow: true,
      onload: false,
    };
  },
  created() {
    // linkme
    var __url = 'https://app.hxsapp.com/actweb/linkup/linkup?id=' + this.json.act_id;

    this.linkedMe = {
      params: {
        // key 是写死的   value是协议，具体见这里－http://wiki.sys.hxsapp.net/pages/viewpage.action?pageId=1998876
        "key": "hxsapp://web?url=" + __url
      }
    }
  },
  mounted() {
    var _this = this;

    // 注入全局数据
    if (_this.$route.params.backTo) {
      _this.json = _this.$route.params.data
    }

    this.$nextTick(function() {
      // 挂载引擎
      this.actData = this.json;
      this.pvData = this.json;
      this.onload = true;

      gameEngine(_this, _this.json);
      var clientH = document.documentElement.clientHeight;
      $("html,body").css("height", clientH + "px");
      $("#gameBox").css({
        margin: "0",
        padding: "0",
        width: "100%",
        height: clientH + "px"
      });
    });
  },
  methods: {
    __resetListen() {
      console.log("listening");
    }
  }
};
</script>
<style lang="less" scoped>
@import "./../assets/common/reset.less";
.noticeWarp{
  color: #000;
}
.pv{
  top: 4rem !important;
  left: 0 !important;
  right: auto !important;
  border-top: 2px solid #254e8c !important;
  border-bottom: 2px solid #254e8c !important;
  border-left: none !important;
  border-right: 2px solid #254e8c !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important; 
  border-top-right-radius: 5px !important;
  border-bottom-right-radius: 5px !important; 
}
</style>
<style>
/* 在别的组件记得干掉这个样式 */
#gameBox {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>


