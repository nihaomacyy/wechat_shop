// pages/mine/mine.js
const databases = require('../../databases/databases.js')
const util = require('../../utils/util.js')
const app = getApp()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		ttguang: 0,
		ttguang30: 0,
		userInfo: {},
		orderInfo: {},
		isHide: false,
		totalmoney: 0,
		goodsInfo: {},
		upgradeShow: false //升级提示标志
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		var that = this
		let userInfo = wx.getStorageSync('userInfo')
		if (userInfo == "") {
			wx.navigateTo({
				url: "/pages/login/login" + "?id=mine"
			})
		} else {
			this.setData({
				isHide: false,
				userInfo: userInfo
			})
			// 成为推广着才弹标
			if (app.globalData.upgradeFlag == 'show') {
				that.setData({
					upgradeShow: true
				})
			}
		}
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},
	/**
	 * 我的订单绑定事件
	 */
	orderDetail: function(e) {

	},
	/** 我的客服绑定事件 */
	myService: function(e) {
		wx.showModal({
			title: '微信客服',
			content: '客服服务号:shagaji',
			showCancel: false,
			confirmText: '复制',
			success(res) {
				if (res.confirm) {
					wx.setClipboardData({
						data: 'shagaji',
						success: function(res) {}
					})
					/* wx.showToast({
					  title: '复制成功',
					  icon: 'success',
					  duration: 2000
					}) */
				} else if (res.cancel) {}
			}
		})
	},
	/**
	 * 退出登录
	 * */
	logout: function(e) {
		// 清空缓存，跳到首页
		wx.clearStorage({
			success: function(res) {
				wx.showToast({
					title: "退出登录成功~",
					icon: 'none',
					duration: 2000,
					success: function() {
						setTimeout(function() {
							wx.switchTab({
								url: "/pages/home/home"
							})
						}, 2000);
					}
				})
			}
		})
	},
	/**
	 * 查看合伙人权益事件
	 * */
	bindEquity: function() {

	},
	bindContact: function() {

	},
	/**
	 * 头部下拉刷新
	 * */
	onPullDownRefresh() {},
	/**
	 * 用户注册
	 * url: "/pages/partner/partner" //原来的跳转
	 * */
	bindRegister: function() {
		wx.navigateTo({
			url: "/package/pages/upgrade/upgrade?id=10086"
		})
	},
	/** 隐藏升级标志**/
	bindUpgradeHide: function() {
		app.globalData.upgradeFlag = 'hide'
		this.setData({
			upgradeShow: false
		})
	}
})
