// pages/upgrade/upgrade.js
const databases = require('../../../databases/databases.js')
const util = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
	detailData:{},
	id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	let upgradeDetailUrl = app.globalData.dataUrl.upgradeDetailUrl + "?id=" + options.id
	this.setData({
		'id':options.id
	})
	this.getDetailData(upgradeDetailUrl)
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
		let that = this;
		wx.getSystemInfo({
			success: res=>{
			let modelmes = res.model;
				if (modelmes.search('iPhone X') != -1) {
					that.setData({
					btuBottom:"68rpx",
					})
				}
			}
		})
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
   * 列表数据
   * */
  getDetailData: function(url) {
  	wx.showLoading({
  		title: 'loading...',
  	})
	
  	var that = this
  	// 请求服务器
  	util.requestUrl({
  		url: url, //不需要域名，因为方法中已经拼接域名
  		params: {},
  		method: "get",
  	}).then((res) => {
		var res = databases.upgradeDetail
  		that.setData({
  			'detailData':res.data.list,
  		})
  		wx.hideLoading()
  	})
  },
  bindUpgrade:function(e){
	  let id = this.data.id
	  wx.navigateTo({
	  	url: "/package/pages/upgradeorder/upgradeorder?id=" + id
	  })
  }
})