// pages/banner/banner.js
const databases = require('../../databases/databases.js')
const util = require('../../utils/util.js')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		themeList: {},
		isEmpty:true,
		page:1
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		if(options.tcode){
			wx.setStorageSync('tcode', options.tcode);
		}
		let themeListUrl = app.globalData.dataUrl.explosivelyUrl + "?page=" + this.data.page + "&type=2&supplier=pin"
		this.getThemeList(themeListUrl)
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
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
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		let userInfo = wx.getStorageSync('userInfo')
		let path = 'pages/clearance/clearance'
		if(userInfo.istg == 1){
			path = 'pages/clearance/clearance?tcode=' + userInfo.tcode
		}
		return {
			title: '品牌清仓',
			path: path
		}
	},
	/**
	 * 获取主题banner
	 * */
	getThemeList: function(url) {
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
			// 读取本地数据 正式换成对应服务器接口即可
			var res = databases.hotList
			wx.hideLoading()
			that.processthemeData(res.data.list)
		})
	},
	processthemeData: function(datas) {
		var goodDatas = [];
		for (var idx in datas) {
			var subject = datas[idx]
			var title = subject.goods_name
			if (title.length >= 20) {
				title = title.substring(0, 30) + "...";
			}
			// 优惠券长度
			let discount = subject.coupon_discount
			let discountLength = 1;
			if (discount == 0) {
				discountLength = -1
			} else {
				discountLength = discount.toString().length
			}
			
			// 赚取价格长度
			let differentialprice = subject.promoting_earning_differential_price;
			let differentialpriceLength = differentialprice.toString().length;
			var temp = {
				id: subject.goods_id,
				title: title, //标
				imageUrl: subject.goods_thumbnail_url, //图片地址
				promotion_rate: subject.promoting_earning_differential_price, //推广赚取价格
				coupon_discount: subject.coupon_discount, //优惠券价格
				min_normal_price: subject.min_group_price, //商品价格
				sales_tip: subject.sales_tip, //已售数量
				sales_price: subject.sales_price, //折后价格
				length: discountLength,
				priceLength:differentialpriceLength
			}
			goodDatas.push(temp)
		}
		var totalGoods = {}
		//如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
		if (!this.data.isEmpty) {
			totalGoods = this.data.themeList.concat(goodDatas);
		} else {
			totalGoods = goodDatas;
			this.data.isEmpty = false;
		}
		this.setData({
			themeList: totalGoods
		});
		this.data.page += 1;
	},
	/**
	 * 
	 * */
	onDetailTap:function(e){
		let goodsId = e.currentTarget.dataset.id
		//判断是否授权，没有授权就跳转登录页面
		//wx.setStorageSync('openid', 'openid123456')
		var userInfo = wx.getStorageSync('userInfo')

		if (userInfo == "") {
			wx.navigateTo({
				url: "/pages/login/login"+"?id="+goodsId
			})
		} else {
			wx.navigateTo({
				url: "/pages/detail/detail"+"?id="+goodsId
			})
		}
	},
	/**
	 * 下拉加载
	 * */
	onReachBottom: function(event) {
		var nextUrl = app.globalData.dataUrl.explosivelyUrl + "?page=" + this.data.page + "&type=2&supplier=pin"
		this.getThemeList(nextUrl)
	}
})
