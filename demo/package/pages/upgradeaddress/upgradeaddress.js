// pages/upgradeaddress/upgradeaddress.js
const databases = require('../../../databases/databases.js')
const util = require('../../../utils/util.js')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		provinces:'北京市',
		citys:'北京城区',
		countrys:'昌平区',
		address:'',
		contact:'',
		phone:'',
		goodsId:'',
		addressId:'',//已创建的地址ID
		fontSet:false,//设置字体颜色
		addrheight:false//根据地址区域字符长度自动增加背景高度
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		let isupdate = options.isupdate
		if(isupdate == 1){
			wx.setNavigationBarTitle({
				title:'编辑地址'
			})
			this.setData({
				'provinces':options.province,
				'citys':options.city,
				'countrys':options.country,
				'contact':options.contact,
				'phone':options.phone,
				'address':options.address,
				'addressId':options.addressId,
				'fontSet':true
			})
		}else{
			wx.setNavigationBarTitle({
				title:'新建地址'
			})
		}
		this.setData({
			goodsId:options.goodsid
		})
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
	//js
	selectCity: function(e) {
		let obj = e.detail
		// 判断地址长度，超长地址需要增加背景高度
		let addr = obj.province + obj.city + obj.country
		let addrLength = addr.toString().length
		if(addrLength > 18){
			this.setData({
				'addrheight':true
			})
		}else{
			this.setData({
				'addrheight':false
			})
		}
		this.setData({
			provinces:obj.province,
			citys:obj.city,
			countrys:obj.county
		})
	},
	/**
	 * 表单提交
	 * */
	formSubmit: function(e) {
		var that = this
		let { contact,phone,address} = e.detail.value;
		let userInfo = wx.getStorageSync('userInfo')
		let regUrl = app.globalData.dataUrl.addAddress
		let addressId = this.data.addressId
		let param = {
			contact:contact,
			phone:phone,
			address:address,
			userid: userInfo.id,
			openid:userInfo.openid,
			province:this.data.provinces,
			city:this.data.citys,
			country:this.data.countrys,
			addressid:addressId
		}
		// 请求服务器
		util.requestUrl({
			url: regUrl, //不需要域名，因为方法中已经拼接域名
			params: param,
			method: "post",
		}).then((res) => {
			var res = databases.address
			if(res.status !== 200){
				wx.showToast({
				    title: res.message,
				    icon: 'none',
				    duration: 2000,
					success:function(){
						that.onLoad()
					}
				})
			}else{
				wx.showToast({
				    title: res.message,
				    icon: 'none',
				    duration: 2000,
					success:function(){
						setTimeout(function() {
							  wx.redirectTo({
								url: "/package/pages/upgradeorder/upgradeorder?id=" + that.data.goodsId
							  })
						}, 1000)
					}
				})
			}
		})
	},
})
