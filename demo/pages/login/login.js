// pages/login/login.js
const databases = require('../../databases/databases.js')
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: true,
		redirectId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
		redirectId:options.id
	})
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
   *  授权登录操作
   */
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
		wx.showLoading({
			title: 'loading...',
		})
		//用户按了允许授权按钮
		var that = this;
		var userInfo = e.detail.userInfo
		var redirectId = this.data.redirectId
		var encryptedData = e.detail.encryptedData
		var signature = e.detail.signature
		var rawData = e.detail.rawData
		var iv= e.detail.iv
		util.login({userInfo,encryptedData,signature,rawData,iv},function(resInfo){
			// 读取本地数据 正式换成对应服务器接口即可
			var resInfo = databases.userInfo.data.userInfo
			if(resInfo == undefined){
				wx.showToast({
				  title: '网络异常,请重新授权',
				  icon: 'none',
				  duration: 2000,
				  mask: true
				})
			}else{
				// wx.setStorageSync('userInfo', resInfo);
				wx.setStorage({
				  key:"userInfo",
				  data:resInfo,
				  success:function(res){
				  	setTimeout(function() {
				  		wx.hideLoading()
				  		//点击授权以后就调回原来的页面
				  		if(redirectId == 'mine'){
				  			wx.switchTab({
				  			  url: '/pages/mine/mine'
				  			})
				  		}else if(redirectId == 'home'){
				  			wx.switchTab({
				  			  url: '/pages/home/home'
				  			})
				  		}else{
				  			wx.redirectTo({
				  				url: "/pages/detail/detail"+"?id="+redirectId,
				  				success:function(res){
				  				},
				  				fail:function(err){
				  				}
				  			})
				  		}
				  	}, 1000);
				  }
				})
			}
		});
    } else {
			// 这里情况可能会分为多种 断网 取消等，默认使用取消
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
          }
        }
      });
    }
  }
})