// pages/upgradeorder/upgradeorder.js
const databases = require('../../../databases/databases.js')
const util = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
	detailData:{},
	id:'',//商品id
	addressShow:false,//是否已经添加过收货地址，切换不同内容
	addressData:{},
	addrheight:false//是否根据地址增加背景高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	let upgradeDetailUrl = app.globalData.dataUrl.upgradeDetailUrl + "?id=" + options.id
	this.setData({
		'id':options.id
	})
	this.getDetailData(upgradeDetailUrl)//获取商品数据
	this.getUserAddress()//获取用户收获地址
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
  /**
   * 获取用户收货地址
   * */
  getUserAddress: function() {
  	var that = this
	let userInfo = wx.getStorageSync('userInfo')
	let getUserAddressUrl = app.globalData.dataUrl.getUserAddress + "?userid=" + userInfo.id
  	// 请求服务器
  	util.requestUrl({
  		url: getUserAddressUrl, //不需要域名，因为方法中已经拼接域名
  		params: {},
  		method: "get",
  	}).then((res) => {
		var res = databases.address
		let subject = res.data.list
  		if(subject){
			// 判断地址长度，超长地址需要增加背景高度
			let addr = subject.province + subject.city + subject.country + subject.address
			let addrLength = addr.toString().length
			if(addrLength > 18){
				that.setData({
					'addrheight':true
				})
			}
			that.setData({
				'addressShow':true,
				'addressData':subject
			})
		}
  	})
  },
  /** 添加收获地址*/
  bindAddress:function(e){
	  let userInfo = wx.getStorageSync('userInfo')
	  wx.navigateTo({
	  	url: "/package/pages/upgradeaddress/upgradeaddress?userid=" + userInfo.id +"&goodsid=" + this.data.id +"&isupdate=0"
	  })
  },
  /** 更新收获地址*/
  bindUpdateAddress:function(e){
	  let userInfo = wx.getStorageSync('userInfo')
	  let province = this.data.addressData.province
	  let city = this.data.addressData.city
	  let country = this.data.addressData.country
	  let contact = this.data.addressData.contact
	  let phone = this.data.addressData.phone
	  let address = this.data.addressData.address
	  let addressId = this.data.addressData.id //收货地址ID
	  wx.navigateTo({
	  	url: "/package/pages/upgradeaddress/upgradeaddress?userid="
		+ userInfo.id +"&goodsid=" + this.data.id + "&isupdate=1"
		+ "&province=" + province +"&city=" + city + "&country=" + country
		+ "&contact=" + contact +"&phone=" + phone + "&addressId=" + addressId + "&address=" + address
	  })
  },
  /**
   * 微信支付
   * */
   bindWxPay:function(){
  	var that = this
  	let userInfo = wx.getStorageSync('userInfo')
  	let payUrl = app.globalData.dataUrl.weixinPay
  	let addressInfo = this.data.addressData
	let param = {
		openid:userInfo.openid,
		userid:userInfo.id,
		title:'升级礼包',
		money:this.data.detailData.price,
		address:addressInfo
	}
	// 请求服务器
  	util.requestUrl({
  		url: payUrl, 
  		params: param,
  		method: "post",
  	}).then((res) => {
	  var res = databases.payInfo
      wx.requestPayment({
        'timeStamp': res.data.list.timeStamp,
        'nonceStr': res.data.list.nonceStr,
        'package': res.data.list.package,
        'signType': 'MD5',
        'paySign': res.data.list.paySign,
        'success': function (res) {
		  app.globalData.upgradeFlag = 'show'
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000,
			success:function(){
				setTimeout(function() {
					wx.switchTab({
					  url: '/pages/mine/mine'
					})
				}, 2000);
			}
          });
        },
        'fail': function (res) {
        },
        'complete': function (res) {
        }
      });
  	})
   }
})