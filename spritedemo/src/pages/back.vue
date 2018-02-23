<template>
  <div>
    <div class="warp" id="gameBox"></div>
  </div>
</template>
<script>
import Vue from "vue";

// phaser
window.PIXI = require("phaser-ce/build/custom/pixi.min");
window.p2 = require("phaser-ce/build/custom/p2.min");
window.Phaser = require("phaser-ce/build/custom/phaser-split");

var rootUrl;
if (process.env.NODE_ENV === "production") {
  rootUrl = "https://app.hxsapp.com/actweb/linkup/static/source/linkup/";
} else {
  rootUrl = "./static/sprite/";
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
    };
    this.create = function() {
      //预加载
      game.state.start("preload");
    };
  };

  game.States.preload = function(game) {
    this.init = function() {};

    this.preload = function() {
      game.load.spritesheet("ground", rootUrl + "ground_1x1.png", 32, 32, 25);
    };

    this.create = function() {
      game.state.start("main");
    };
  };

  game.States.main = function(game) {
    var _this = this
    this.init = function() {};

    this.preload = function() {};

    this.create = function() {
      var ground = game.add.group();
      initGround(3)
      function initGround(stage){
        var size = (5 - stage) * 32
        function makeGround(index=0) {
          var rand = Math.round(Math.random() * 25);

          var x = index * size
          var y = 0
          
          if(x > 900){
            y = Math.floor(x/900) * size
            x -= Math.floor(x/900) * 900
            if(x%size != 0){
              x -= x%size
            }
            if((x/size) != 0){
              x -= size
            }
          }

          var sprite = ground.create(x,y,"ground",rand);
          sprite.scale.setTo(size/32)
        }

        var time = Math.ceil(900/size) * Math.ceil(1200/size)
        console.log(time)
        for (var i = 0; i < time; i++) {
          makeGround(i)
        }
      }
    };
  };

  //舞台配置
  game.state.add("boot", game.States.boot);
  game.state.add("preload", game.States.preload);
  game.state.add("main", game.States.main);

  //主线程启动
  game.state.start("boot");
}
export default {
  name: "back",
  components: {},
  data() {
    return {};
  },
  create() {},
  mounted() {
    gameEngine(this, "");
    var clientH = document.documentElement.clientHeight;
    $("html,body").css("height", clientH + "px");
    $("#gameBox").css({
      margin: "0",
      padding: "0",
      width: "100%",
      height: clientH + "px"
    });
  },
  methods: {}
};
</script>
