// pages/upgrade/upgrade.js
const databases = require('../../../databases/databases.js')
const util = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		dataList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.getUpgradeList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
		
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
		
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 获取升级礼包列表
   * */
  getUpgradeList:function(){
	wx.showLoading({
		title: 'loading...',
	})
  	let upgradeUrl = app.globalData.dataUrl.upgradeUrl
  	var that = this
  	// 请求服务器
  	util.requestUrl({
  		url: upgradeUrl, //不需要域名，因为方法中已经拼接域名
  		params: {},
  		method: "get",
  	}).then((res) => {
		var res = databases.upgradeList
  		that.setData({
  			'dataList': res.data.list
  		});
		wx.hideLoading()
  	})
  },
  getDetail:function(e){
	  let id = e.currentTarget.dataset.id
	wx.navigateTo({
		url: "/package/pages/upgradedetail/upgradedetail?id=" + id
	})
  }
})