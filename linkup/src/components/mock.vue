<template>
  <div>
  </div>
</template>
<script>
export default {
  name: 'localmock',
  data() {
    return {
      rebackData: null
    }
  },
  props: {
    data: {
      type: [Object, String],
      default: ''
    },
  },
  mounted() {
    this.mock()
  },
  methods: {
    sendData(sendThing) {
      var _this = this
      this.$emit('listenMock', sendThing)
    },
    mock() {
      var _this = this
      var Mock = require('mockjs')
      var mockData = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        "data": {
          'rebackName|30': ["@cname(2,5)"],
          'rebackGift|30': ['@cword(2, 5)']
        }
      })
      _this.rebackData = mockData
      _this.sendData(mockData)
    },
  },
  watch: {
    dataToMock: function() {
      this.sendData()
    },
  }
}
</script>

<style lang='less' scoped>
@import './../assets/common/reset.less';
</style>