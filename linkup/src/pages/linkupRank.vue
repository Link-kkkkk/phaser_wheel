<template>
  <div class="warp">
    <transition name='switch'>
      <div class="infoPage" v-show='infoPage'>
        <div class="headBg"></div>
        <!-- <div class="textboxBg_1"></div>
        <div class="textboxBg_2"></div> -->
        <div class="head" v-show='!userIn'></div>
        <div class="inHead" v-show='userIn'>
          <img :src='userHeadImg'>
        </div>
        <!-- <div class="textBox">
          <p>{{loseText}}</p>
        </div> -->
        <div class="textBox_2">
          <p>您的成绩:{{grade}}</p>
          <!-- <p>击败全国{{percent}}的用户</p> -->
        </div>
        <!-- <div class="textBox_3">
          <p>最佳成绩为:{{bestGrade}}</p>
          <p>最佳排名为:{{bestRank}}</p>
        </div> -->
        <div class="playBtn" @click='backGame'></div>
        <div class="rankBtn" @click='switchPage(1)'></div>
        <!-- <div :class="drawBtn" @click='goDraw'></div> -->
      </div>
    </transition>
    <transition name='switch'>
      <div class="rankPage" v-show="!infoPage">
        <div class="closeBtn" @click='switchPage(2)'></div>
        <!-- <div :class="titleBtn_2" @click='switchRank("rank")'></div> -->
        <div class="titleBtn"></div>
        <div v-show="!ruleshow">
          <div class="srankBoxTit">
            <p class="userRank">您的当前排名:<span class="rankColor">{{bestRank}}</span> (分数：{{bestGrade}})</p>
            <div class="srankTit"></div>
          </div>
          <div class="srankBox">
            <div class="rankList" v-for='(data,index) in rankNameArr' :key='index'>
              <p>{{index + 1}}</p>
              <div class="userHead">
                <img :src='rankImgArr[index]'>
              </div>
              <p>{{rankNameArr[index]}}</p>
              <p>{{rankGradeArr[index]}}</p>
            </div>
          </div>
        </div>
        <div class="startBtn" @click="backGame()"></div>
      </div>
    </transition>
    <preload></preload>
    <down :downLink='href' :linkedMe='linkedMe' v-if="onload"></down>
    <share :actData='actData' v-if="onload"></share>
    <pv :pv-data='pvData' v-if="onload"></pv>
    <foot></foot>
    <buried></buried>
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

export default {
  name: "init",
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
        model_idfa: com.$_GET("model_idfa")
      },
      href: "https://www.hxsapp.com/download",
      resetData: null,
      act_id: "",
      actData: null,
      linkedMe: null,
      pvData: null,
      pvshow: true,
      onload: false,

      userHeadImg: "",
      loseText: "挑战失败",
      grade: 0,
      percent: "50%",
      bestGrade: 0,
      bestRank: "0",
      use: "",
      userIn: true,
      infoPage: true,
      mode:'rank',

      canGoDraw: true,
      ruleshow: false,
      rankArr: [],
      rankImgArr: [],
      rankNameArr: [],
      rankGradeArr: []
    };
  },
  mounted() {
    var _this = this;

    _this.json = _this.$route.params.data

    this.$nextTick(function() {
      var clientH = document.documentElement.clientHeight;
      $("html,body,.warp,.infoPage,.rankPage").css("height", clientH + "px");
      $(".titleBtn").css("top", clientH / 10.5 + "px");
      $(".srankBoxTit").css("top", clientH * 210 / 1200 + "px");
      $(".startBtn").css("top", clientH * 1025 / 1200 + "px")
      $(".srankBox").css({
        top: clientH * 330 / 1200 + "px",
        height: clientH * 615 / 1200 + "px"
      });

      if (_this.$route.params.data) {
        _this.getParams();
      }else{
        _this.userIn = false;
        _this.mode = 'test'
      }

      this.actData = this.json;
      this.pvData = this.json;
      this.onload = true;
      
      // if (com.$_GET("sess_token").length < 10) {
      //   _this.userIn = false;
      // }

      _this.share();
      _this.getHead();
      _this.getWinnerList();

      console.log(this.$route.params)
    });
  },
  methods: {
    getParams() {
      var _this = this;
      var point = 0
      if(_this.$route.params.type == 'check'){
        _this.infoPage = true
        _this.grade = _this.$route.params.gameData.point + '分';
        _this.mode = 'check'

        _this.savePoint();
      }else{
        _this.infoPage = false
        _this.mode = 'rank'
      }
    },
    getHead () {
      var _this = this;
      var point = 0
      this.$http.jsonp(
        "https://act.hxsapp.com/game/ChristmasEliminate/getUserHeadImg",
        { params: _this.json }
      )
      .then(function(data) {
        if (data.data.code == 200) {
          _this.userHeadImg = data.data.data.head_img;
        }
      });
    },
    share() {
      var _this = this;
      this.$http
        .jsonp(_this.$common.common._ACTHOST + "/feedbackGift/Mod/actInfo", {
          params: _this.json
        })
        .then(function(data) {
          if (data.data.code == 200) {
            this.$common.actjs.shareFun(
              data.data.data,
              _this.$common.common._ACTHOST +
                "/html/linkup/dist/index.html?rute=game&id=" +
                _this.json.act_id
            );
            _this.pageTitle = data.data.data.title;
            document.title = data.data.data.title;
          }
        });
    },
    backGame() {
      var _this = this;
      this.$router.replace({
        name: "linkup",
        params: {
          data: _this.json,
          backTo: true
        }
      });
    },
    switchPage(page) {
      var _this = this;
      if (page == 1) {
        _this.infoPage = false;
      } else if (page == 2) {
        if(_this.mode == 'rank'){
          _this.backGame()
        }
        _this.infoPage = true;
      }
    },
    switchRank(type) {
      var _this = this;
      if (type == "rule") {
        _this.ruleshow = true;
      } else if (type == "rank") {
        _this.ruleshow = false;
      }
    },
    savePoint() {
      var _this = this;
      var saveData = {
        sess_token: _this.json.sess_token,
        act_id: _this.json.act_id,
        score: _this.$route.params.gameData.point
      };

      this.$http.jsonp(
        "https://act.hxsapp.com/game/ChristmasEliminate/saveUserScore",
        { params: saveData }
      )
      .then(function(data) {
        if (data.data.code == 200) {
          // _this.percent = data.data.data.range;
          // _this.bestGrade = data.data.data.optimum_score;
          // _this.bestRank = "NO." + data.data.data.optimum_ranking;
        }
      });
    },
    getWinnerList() {
      var _this = this;
      this.$http.jsonp("https://act.hxsapp.com/game/ChristmasEliminate/rankings", {
          params: _this.json
        })
        .then(function(data) {
          if (data.data.code == 200) {
            // _this.percent = data.data.data.range;
            _this.bestGrade = data.data.data.personal_info.score;
            _this.bestRank = "NO." + data.data.data.personal_info.ranking;

            for (var i = 0; i < data.data.data.ranking_info.length; i++) {
              _this.rankNameArr.push(
                _this.subStlength(data.data.data.ranking_info[i].nickname, 4, 4)
              );
              _this.rankGradeArr.push(data.data.data.ranking_info[i].score);
              _this.rankImgArr.push(data.data.data.ranking_info[i].head_img);
            }
          }
        });
    },
    subStlength(str, maxLength, targetLength) {
      if (str) {
        var reg = /^[A-Za-z]+$/;
        var re = /^[0-9a-zA-Z]*$/g;
        if (reg.test(str) || re.test(str)) {
          if (str.length > 2 * maxLength)
            str = str.substring(0, 2 * targetLength) + "...";
        } else {
          if (str.length > maxLength)
            str = str.substring(0, targetLength) + "...";
        }
      }
      return str;
    }
  },
  watch: {
    $route: "getParams()"
  }
};
</script>
<style lang="less" scoped>
@import "./../assets/common/reset.less";

.infoPage {
  .back(100%, 40.2rem,"../img/bg.jpg");
  position: relative;
}
.rankPage {
  .back(100%, 40.2rem,"../img/rankBg.jpg");
  position: relative;
}
.headBg {
  .back(6.9rem, 6.9rem,"../img/headBg.png");
  position: absolute;
  top: 3.95rem;
  .center(6.9rem);
}
.closeBtn {
  .back(1.5rem, 1.5rem, "../img/close_3.png");
  position: absolute;
  top: 1.166667rem;
  right: 1.16666rem;
  cursor: pointer;
}
.rankColor{
  color: #ffdf41
}
.head {
  .back(6.4rem, 6.4rem, "../img/head.png");
  position: absolute;
  top: 4.2rem;
  .center(6.4rem);
  border-radius: 50%;
}
.inHead {
  width: 6.4rem;
  height: 6.4rem;
  position: absolute;
  top: 4.2rem;
  .center(6.4rem);
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.textboxBg_1 {
  .back(19.533333rem, 6rem, "../img/rankpointBg.png");
  position: absolute;
  .center(19.5333rem);
  top: 12.2rem;
}
.textboxBg_2 {
  .back(19.533333rem, 6rem, "../img/rankpointBg.png");
  position: absolute;
  .center(19.5333rem);
  top: 18.53rem;
}
.textBox {
  width: 100%;
  position: absolute;
  top: 11.2rem;
  p {
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
    color: #fff;
  }
}
.textBox_2 {
  width: 100%;
  position: absolute;
  top: 13.8rem;
  p:nth-child(1) {
    text-align: center;
    color: #ffdf41;
    font-size: 1.2rem;
  }
  p:nth-child(2) {
    text-align: center;
    color: #fff;
    font-size: 1rem;
  }
}
.textBox_3 {
  width: 100%;
  position: absolute;
  top: 20rem;
  p:nth-child(1) {
    text-align: center;
    color: #fff;
    font-size: 1.2rem;
  }
  p:nth-child(2) {
    text-align: center;
    color: #fff;
    font-size: 1rem;
  }
}
.playBtn {
  .back(12.43rem, 3.53rem,"../img/btn_1.png");
  position: absolute;
  top: 22.87rem;
  .center(12.43rem);
  cursor: pointer;
}
.rankBtn {
  .back(12.43rem, 3.53rem,"../img/btn_2.png");
  position: absolute;
  top: 27.17rem;
  .center(12.43rem);
  cursor: pointer;
}
.drawBtn {
  .back(8.1rem, 2.733333rem,"../img/btn_3.png");
  position: absolute;
  top: 33.666667rem;
  right: 4.2rem;
  cursor: pointer;
}
.drawBtn_on {
  .back(8.1rem, 2.733333rem,"../img/btn_4.png");
  position: absolute;
  top: 33.666667rem;
  right: 4.2rem;
  cursor: pointer;
}
.btn_1 {
  .back(6.9rem, 2rem,"../img/ranktab_1.png");
  position: absolute;
  top: 4rem;
  left: 5.3rem;
  cursor: pointer;
}
.btn_1_on {
  .back(6.9rem, 2rem,"../img/ranktab_3.png");
  position: absolute;
  top: 4rem;
  left: 5.3rem;
  cursor: pointer;
}
.btn_2 {
  .back(6.9rem, 2rem,"../img/ranktab_2.png");
  position: absolute;
  top: 4rem;
  right: 5.3rem;
  cursor: pointer;
}
.btn_2_on {
  .back(6.9rem, 2rem,"../img/ranktab_4.png");
  position: absolute;
  top: 4rem;
  right: 5.3rem;
  cursor: pointer;
}
.titleBtn{
  .back(6.9rem, 2rem,"../img/ranktab.png");
  position: absolute;
  top: 4rem;
  .center(6.9rem);
  cursor: pointer;
}
.ruleTextBox {
  position: absolute;
  width: 19.666667rem;
  top: 8rem;
  font-size: 0.866667rem;
  line-height: 1.5rem;
  color: #fff;
  .center(19.66rem);
}
.srankBoxTit {
  position: absolute;
  width: 21.666667rem;
  height: 26rem;
  top: 6.5rem;
  font-size: 0.866667rem;
  .center(21.66rem);
}
.srankBox {
  position: absolute;
  width: 21.666667rem;
  height: 26rem;
  top: 10.5rem;
  font-size: 0.866667rem;
  .center(21.66rem);
  overflow: auto;
}
.userRank {
  font-size: 1rem;
  color: #fff;
  margin-left: 1rem;
}
.srankTit {
  .back(21.466667rem, 1.933333rem,"../img/rankTit.png");
  width: 100%;
  margin: 0.5rem 0;
}
.srankBox::-webkit-scrollbar {
  display: none;
}
.startBtn{
  .back(9.03rem, 2.8rem,"../img/startBtn.png");
  .center(9.03rem);
  position: absolute;
  top: 34.17rem;
}
.rankList {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  height: 3.666667rem;
  line-height: 3.666667rem;
  color: #fff;
  padding-right: 1rem;
  p {
    display: -webkit-box;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    text-align: center;
    overflow: hidden;
  }
  p:nth-child(1) {
    width: 20%;
  }
  p:nth-child(2) {
    width: 30%;
  }
  p:nth-child(3) {
    width: 40%;
  }
  p:nth-child(4) {
    width: 10%;
  }
}
.userHead {
  // .back(2.7rem,2.7rem,'../img/head.png');
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 50%;
  margin-top: 0.47rem;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.noticeWarp{
  color: #000;
}
.pv{
  top: 3rem !important
}
</style>