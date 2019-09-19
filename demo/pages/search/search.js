// pages/search/search.js
const databases = require('../../databases/databases.js')
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
	historyData:[],//搜索后得到的数据
	isHasList:false,//是否进入搜索模式
	goodsList: {}, //列表数据
	isEmpty: true,//是否是第一次渲染数据
	page:1,//当前页码
	searchWord:'',//当前搜索关键词
	searchIcon:'../../images/icon_switch.png',
	searchIconFlag:1,
	sortList: {
		i: 0,
		sort: [{
				key: 0,
				title: "默认",
				isShowImg: false,
				flag: 0
			},
			{
				key: 1,
				title: "销量",
				isShowImg: false,
				flag: 0
			},
			{
				key: 2,
				title: "价格",
				isShowImg: true,
				flag: 3
			},
			{
				key: 3,
				title: "佣金",
				isShowImg: true,
				flag: 3
			},
		]
	}, //排序
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  let storageHistoryData = wx.getStorageSync('historyData')
	  if(storageHistoryData !== ""){
		  this.setData({
			'isHasList':false,
		  	'historyData':storageHistoryData
		  })
	  }
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
   * 添加搜索历史
   * */
  bindSearch:function(e){
	  let searchWord = e.detail.value//获取输入的值
	  let historyData = this.data.historyData//获取当前已存在历史输入值
	  let historyLength = historyData.length
	  if(historyLength <= 7){
		  historyData.splice(0,0,searchWord)//添加到第一个
	  }else{
		  historyData.pop()//删除最后一个
		  historyData.splice(0,0,searchWord)//在添加到第一个
	  }
	  this.setData({
		  'searchWord':searchWord,
		  'historyData':historyData
	  })
	  wx.setStorageSync('historyData',historyData)
	  //每次输入框发生变化的时候就要清空现有的数据
	  this.resetPage()
	  var defaultGoodsUrl = app.globalData.dataUrl.searchList + "?word=" + searchWord + "&supplier=pin&page=1" + "&coupon=" + this.data.searchIconFlag
	  this.getGoodsListData(defaultGoodsUrl)
  },
  /**
   * 列表数据
   * */
  getGoodsListData: function(url) {
	wx.showLoading({
		title: 'loading...',
	})
  	var that = this
  	// 请求服务器创建用户
  	util.requestUrl({
  		url: url, //不需要域名，因为方法中已经拼接域名
  		params: {},
  		method: "get",
  	}).then((res) => {
		// 读取本地数据 正式换成对应服务器接口即可
		var res = databases.goodsList
  		that.processGoodsData(res.data.list)
  	}).catch(function(err) {
  	});
  },
  processGoodsData: function(goods) {
  	var goodDatas = [];
  	for (var idx in goods) {
  		var subject = goods[idx]
  		var title = subject.goods_name
  		if (title.length >= 20) {
  			title = title.substring(0, 25) + "..."
  		}
		// 优惠券长度
		let discount = subject.coupon_discount
		let discountLength = 1;
		if(discount == 0){
			discountLength = -1
		}else{
			discountLength = discount.toString().length
		}
  		var temp = {
  			id: subject.goods_id,
  			title: title, //标
  			imageUrl: subject.goods_thumbnail_url, //图片地址
  			promotion_rate: subject.promoting_earning_differential_price, //推广赚取价格
  			coupon_discount: subject.coupon_discount, //优惠券价格
  			min_normal_price: subject.min_group_price, //商品价格
  			sales_tip: subject.sales_tip, //已售数量
  			sales_price: subject.sales_price, //折后价格
			length:discountLength
  		}
  		goodDatas.push(temp)
  
  	}
  	var totalGoods = {}
  	//如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
  	if (!this.data.isEmpty) {
  		totalGoods = this.data.goodsList.concat(goodDatas)
  	} else {
  		totalGoods = goodDatas
  		this.data.isEmpty = false
  	}
  	this.setData({
  		'goodsList': totalGoods,
		'isHasList':true,
  	});
	this.data.page += 1;
	wx.hideLoading()
  },
  /**
   * 切换排序 */
  onChangeSort: function(e) {
  	var i = e.target.dataset.key;
  	if (i == 2) {
  		var obj = this.data.sortList.sort
  		var currentFlag = obj[i].flag
  		obj[3].flag = 3;
  		if (currentFlag == 3) {
  			obj[i].flag = 1;
  			this.setData({
  				'sortList.sort': obj
  			});
  		} else if (currentFlag == 1) {
  			obj[i].flag = 2;
  			this.setData({
  				'sortList.sort': obj
  			});
  		} else if (currentFlag == 2) {
  			obj[i].flag = 1;
  			this.setData({
  				'sortList.sort': obj
  			});
  		}
  	} else if (i == 3) {
  		var obj = this.data.sortList.sort
  		var currentFlag = obj[i].flag
  		obj[2].flag = 3;
  		if (currentFlag == 3) {
  			obj[i].flag = 1;
  			this.setData({
  				'sortList.sort': obj
  			});
  		} else if (currentFlag == 1) {
  			obj[i].flag = 2;
  			this.setData({
  				'sortList.sort': obj
  			});
  		} else if (currentFlag == 2) {
  			obj[i].flag = 1;
  			this.setData({
  				'sortList.sort': obj
  			});
  		}
  	} else {
  		var obj = this.data.sortList.sort
  		obj[2].flag = 3;
  		obj[3].flag = 3;
  		this.setData({
  			'sortList.sort': obj
  		});
  	}
  	this.setData({
  		'sortList.i': i
  	});
  	this.resetPage() //点击排序，清除缓存页数
	let currentSortId = this.getSortId(); //当前排序ID
  	let changeGoodsUrl = app.globalData.dataUrl.searchList + "?word=" + this.data.searchWord + "&supplier=pin&page=1" + "&sort=" + currentSortId + "&coupon=" + this.data.searchIconFlag
	this.getGoodsListData(changeGoodsUrl)
  },
  /**
   * 初始化数据和分页
   * */
  resetPage: function() {
  	this.setData({
  		'page': 1,
  		'isEmpty': true,
		'goodsList':{}
  	});
  },
  
  /**
   * 历史记录搜索
   * */
   bindSearchHistory:function(e){
	   let searchWord = e.target.dataset.serach
	   //点击历史记录的时候，也要设置到data里面，方便翻页的时候调用
	   let currentSortId = this.getSortId(); //当前排序ID
	   this.setData({
	   	'searchWord': searchWord
	   });
	   //每次输入框发生变化的时候就要清空现有的数据
	   this.resetPage()
	   var defaultGoodsUrl = app.globalData.dataUrl.searchList + "?word=" + searchWord + "&supplier=pin&page=1" + "&sort=" + currentSortId + "&coupon=" + this.data.searchIconFlag
	   this.getGoodsListData(defaultGoodsUrl)
   },
   /**
    * 下拉加载
    * */
   onReachBottom: function(event) {
	let isHasList = this.data.isHasList
	let searchWord = this.data.searchWord
	let currentSortId = this.getSortId(); //当前排序ID
	if(isHasList){
		let nextUrl = app.globalData.dataUrl.searchList + "?word=" + searchWord + "&page=" + this.data.page +
			"&supplier=pin" + "&sort=" + currentSortId + "&coupon=" + this.data.searchIconFlag
		this.getGoodsListData(nextUrl)
	}
   },
   /**
	* 商品详情
	* */
   getDetail:function(e){
	   var goodsId = e.currentTarget.dataset.goodsid
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
	* 返回首页
	* */
   bingCancel:function(){
	  wx.switchTab({
	  	url: "/pages/home/home"
	  })
   },
   /**
	* 清除搜索历史
	* */
   bindDeleteHistory:function(){
	   this.setData({
		   'historyData':[]
	   })
   },
   /**
    * 获取当前选择排序的id
    * */
   getSortId: function() {
   	var sortId = ''; //真正拿去调用接口的排序id 1销量 2价格升 3价格降 4佣金升 5佣金降
   	var currentSortIndex = this.data.sortList.i
   	if (currentSortIndex == 0) {
   		sortId = 0
   	} else if (currentSortIndex == 1) {
   		sortId = 1
   	} else if (currentSortIndex == 2) {
   		var sortFlag = this.data.sortList.sort[currentSortIndex].flag
   		if (sortFlag == 1) {
   			sortId = 2
   		} else {
   			sortId = 3
   		}
   	} else if (currentSortIndex == 3) {
   		var sortFlag = this.data.sortList.sort[currentSortIndex].flag
   		if (sortFlag == 1) {
   			sortId = 4
   		} else {
   			sortId = 5
   		}
   	}
   	return sortId
   },
   bindChangeTap:function(e){
	   let flag = this.data.searchIconFlag;
	   if(flag==1){
		   this.setData({
			   'searchIcon':'../../images/icon_switch copy.png',
			   'searchIconFlag':0
		   })
	   }else{
		   this.setData({
			   'searchIcon':'../../images/icon_switch.png',
			   'searchIconFlag':1
		   })
	   }
	   this.resetPage() //点击排序，清除缓存页数
	   let currentSortId = this.getSortId(); //当前排序ID
	   let changeGoodsUrl = app.globalData.dataUrl.searchList
		+ "?word=" + this.data.searchWord
		+ "&supplier=pin&page=1"
		+ "&sort=" + currentSortId
		+ "&coupon=" + this.data.searchIconFlag
	   this.getGoodsListData(changeGoodsUrl)
   },
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
   /** 键盘输入文字事件 **/
   bindChange:function(e){
	   let searchWord = e.detail.value//获取输入的值
	   this.setData({
		  searchWord:searchWord
	   })
   },
   /** 查询按钮事件 **/
   bindCancelSearch:function(){
	   let searchWord = this.data.searchWord//获取输入的值
	   let historyData = this.data.historyData//获取当前已存在历史输入值
	   let historyLength = historyData.length
	   if(historyLength <= 7){
	   		  historyData.splice(0,0,searchWord)//添加到第一个
	   }else{
	   		  historyData.pop()//删除最后一个
	   		  historyData.splice(0,0,searchWord)//在添加到第一个
	   }
	   this.setData({
	   		'historyData':historyData
	   })
	   wx.setStorageSync('historyData',historyData)
	   //每次输入框发生变化的时候就要清空现有的数据
	   this.resetPage()
	   var defaultGoodsUrl = app.globalData.dataUrl.searchList + "?word=" + searchWord + "&supplier=pin&page=1" + "&coupon=" + this.data.searchIconFlag
	   this.getGoodsListData(defaultGoodsUrl)
   }
})