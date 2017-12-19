<template>
  <transition name="pvAni">
    <div v-if="pvShow" class="pv">
      <p>{{pvNum}}</p>
    </div>
  </transition>
</template>
<script>
import com from './../util/common'
export default {
  name: 'pv',
  data() {
    return {
      pvShow: true,
      pvNum: ''
    }
  },
  props: {
    pvData: {
      type: [Object, String],
      default: {
        sess_token: null,
        act_id: null,
        model_idfa: null,
      }
    },
  },
  mounted() {
    this.$nextTick(function() {
      this.getPv()
    })
  },
  methods: {
    getPv() {
      var _this = this
      var json = {
        act_id: this.pvData.act_id,
        sess_token: this.pvData.sess_token,
        model_idfa: this.pvData.model_idfa
      }
      this.$http.jsonp('https://act.hxsapp.com' + '/base/Api/pv', { params: json })
        .then(function(data) {
          if (data.data.code == 200) {
            _this.pvNum = data.data.data.sum + '人参加'
          }
        })
    },
    con() {
      console.log('i come from pv components')
      //触发parent组件v-on:post
      this.$emit('post')
    },
    hidding() {
      this.pvShow = false
    }
  }
}
</script>
<style lang='less' scoped>
.pv {
  z-index: 5;
  position: absolute;
  right: 0;
  top: 8px;
  background-color: #FFFFFF;
  border-top: 2px solid #39d9ab;
  border-bottom: 2px solid #39d9ab;
  border-left: 2px solid #39d9ab;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  font-size: 10px;
}

.pv p {
  font-size: 10px;
}

.pvAni-enter-active {
  animation-name: slideInRight;
  animation-duration: .5s;
}

.pvAni-leave-active {
  animation-name: slideOutRight;
  animation-duration: .5s;
}
</style>