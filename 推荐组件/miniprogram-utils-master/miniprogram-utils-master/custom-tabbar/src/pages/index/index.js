// 获取app实例，里面有app.js定义的各个对象
const app = getApp()
// 将公共方法提取出来
Page({
  data: {
    auth: 0
  },
  onLoad: function() {},
  onReady: function() {},
  onShow() {
  },
  changeAuth() {
    this.setData({
      auth: this.data.auth < 5 ? 10 : 0
    })
  }
})