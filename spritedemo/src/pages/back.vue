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
      game.load.spritesheet('tank', rootUrl + 'tank.png', 48, 41, 4)
    };

    this.create = function() {
      game.state.start("main");
    };
  };

  game.States.main = function(game) {
    var _this = this
    let stage = 1
    let showPoint = 10
    let btn
    let cursors
    let addOnce = true
    this.init = function() {};

    this.preload = function() {};

    this.create = function() {
      cursors = game.input.keyboard.createCursorKeys();

      this.createGround(stage)
      // setInterval( () => {
      //   index++
      //   this.createGround(index)
      // },2000)
    };

    this.createGround = function(stage) {
      var ground = game.add.group();

      initGround(stage)

      function initGround(stage,x,y){
        var size = 4 * 32 * Math.pow(0.98,stage)
        var time = Math.ceil(750/size) * Math.ceil(1200/size)

        makeGround(time)

        function makeGround(makeTime=0) {        
          for(var i = 0; i < makeTime; i++){
            var rand = Math.round(Math.random() * 25);
            var x = i * size
            var y = 0

            if(x > 780){
              y = Math.floor(x/780) * size
              x -= Math.floor(x/780) * 780
              x -= x%size
            }
            // x += rand
            // y += rand
            var sprite = ground.create(x,y,"ground",rand);
            sprite.scale.setTo(size/32)

            if(i == showPoint){
              btn = game.add.button(x, y, 'tank', tap ,this, 0, 0, 0);
              btn.animations.add('walk')
              btn.animations.play('walk', 30, true)
              btn.width = sprite.width
              btn.height = sprite.height
              sprite.kill()
            }
          }

          function tap() {
            stage++
            btn.destroy()
            ground.destroy()
            _this.createGround(stage)
            showPoint = Math.round(Math.random() * time);
          }
        }
      }
    }
    this.update = function(){
      if (cursors.left.isDown)
      {
          if(addOnce){
            var addSprite = game.add.image(btn.x,btn.y,"ground",5)
            addSprite.width = btn.width
            addSprite.height = btn.height
            addOnce = false
          }
          btn.x += -20;
      }
      else if (cursors.right.isDown)
      {
        if(addOnce){
            var addSprite = game.add.image(btn.x,btn.y,"ground",5)
            addSprite.width = btn.width
            addSprite.height = btn.height
            addOnce = false
          }
          btn.x += 20;
      }

      if (cursors.up.isDown)
      {
        if(addOnce){
            var addSprite = game.add.image(btn.x,btn.y,"ground",5)
            addSprite.width = btn.width
            addSprite.height = btn.height
            addOnce = false
          }
          btn.y += -20;
      }
      else if (cursors.down.isDown)
      {
        if(addOnce){
            var addSprite = game.add.image(btn.x,btn.y,"ground",5)
            addSprite.width = btn.width
            addSprite.height = btn.height
            addOnce = false
          }
          btn.y += 20;
      }
    }
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
