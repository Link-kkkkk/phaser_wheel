<template>
  <div class="noticeWarp" v-html='data'>
  </div>
</template>

<script>
export default {
  name: 'foot_notice',
  data() {
    return {
      data: null
    }
  },
  props: {
    text: {
      type: [Object, String],
      default: '活动最终解释权归好享瘦APP所有'
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.entry()
    })
  },
  methods: {
    entry() {
      let UserAgent = window.navigator.userAgent;
      if (UserAgent.indexOf('iPhone') != -1 || UserAgent.indexOf('iPad') != -1) {
        this.data = '<p>活动最终解释权归好享瘦APP所有 本活动与苹果公司无关</p>'
        // this.data = '<p>活动最终解释权归好享瘦APP所有 </p>'
      } else if (UserAgent.indexOf('Android') != -1) {
        this.data = '<p>活动最终解释权归好享瘦APP所有 </p>'
      }
    }
  }
}
</script>

<style>
.noticeWarp {
  color: #ccc;
  position: absolute;
  bottom: 0rem;
  width: 100%;
  text-align: center;
  font-size: 10px;
}
</style>

