// pages/home/home.js
const databases = require('../../databases/databases.js')
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
	swiperNav: {
		i: 0,
		arr: []
	},//分类导航
	currentCateIdx: 0, //当前分类位置--下标
	goodsList: {}, //列表数据
	themeList:{},//主题banner
	page: 1, //分页
	isEmpty: true, //判断列表是不是第一次加载数据
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
	modelShow: false, //是否显示分类弹框
	modelLocked: false, //是否锁定分类弹框
	istg:true,//首页是否隐藏注册合伙人
	reportList:{}//快报
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	var that = this
	var defaultGoodsUrl = app.globalData.dataUrl.goodsList + "?cate=1" + "&supplier=pin" + "&sort=0" + "&page=1";
	if (Object.keys(this.data.swiperNav.arr).length === 0) {
		this.getCatesList(app.globalData.dataUrl.catesList,function(list){
			var xiabiao = 0
			// 获取携带参数，并判断是否是从别人转发的链接进来的 cateid 频道id tcode 推广id
			if(options && options.cateid){
				if(options.tcode){
					wx.setStorageSync('tcode', options.tcode);
				}
				for(var ii in list){
					if(list[ii]['cate']==options.cateid) 
					{
						xiabiao = ii
						break;
					}
				}
				let cateid = options.cateid //当前分类ID
				defaultGoodsUrl = app.globalData.dataUrl.goodsList + "?cate=" + cateid + "&supplier=pin" + "&sort=0" + "&page=1";
				that.setData({
					'swiperNav.i': xiabiao
				})//设置当前分类
				that.selectCurrentClikcCates(xiabiao)//跳到当前分类
			}
	if (options.scene) {//判断一下是否是扫码过来的
	  let scene = decodeURIComponent(options.scene) 
	  wx.setStorageSync('tcode', scene);
	}
		})
		
	} else {
		// 初始化列表数据
		var currentSortId = this.getSortId(); //当前排序ID
		var currentNavIndex = this.data.swiperNav.i //获取当前分类位置
		var currentCateObj = this.data.swiperNav.arr //获取当前分类对象
		var currentCateId = this.data.swiperNav.arr[currentNavIndex].cate //获取当前分类ID
		var defaultGoodsUrl = app.globalData.dataUrl.goodsList + "?cate=" + currentCateId + "&page=" + this.data.page +
			"&supplier=pin" + "&sort=" + currentSortId
	}
	this.getGoodsListData(defaultGoodsUrl)
	let userInfo = wx.getStorageSync('userInfo')
	if (userInfo == "") {
		this.setData({
			'istg':true
		})
	} else {
		this.setData({
			'istg':true
		})
	}
	this.getThemeList()
	this.getReportList()
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
   * 分类数据
   * */
  getCatesList: function(url,func) {
  	var that = this
  	// 请求服务器
  	util.requestUrl({
  		url: url, //不需要域名，因为方法中已经拼接域名
  		params: {},
  		method: "get",
  	}).then((res) => {
		// 读取本地数据 正式换成对应服务器接口即可
		var res = databases.navList
  		that.processCatesData(res.data.list)
  		func(res.data.list)
  	})
  },
  /**
   * 分类回调
   * 
   * */
  processCatesData(cates) {
  	this.setData({
  		'swiperNav.arr': cates
  	});
  },
  
  /**
   * 列表数据
   * */
  getGoodsListData: function(url) {
  	var that = this
  	// 请求服务器
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
  			title = title.substring(0, 25) + "...";
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
  		totalGoods = this.data.goodsList.concat(goodDatas);
  	} else {
  		totalGoods = goodDatas;
  		this.data.isEmpty = false;
  	}
  	this.setData({
  		goodsList: totalGoods
  	});
  	
  	this.data.page += 1;
  },
  
  /**
   * 获取主题banner
   * */
  getThemeList:function(){
  	let themeUrl = app.globalData.dataUrl.themeUrl
  	var that = this
  	// 请求服务器
  	util.requestUrl({
  		url: themeUrl, //不需要域名，因为方法中已经拼接域名
  		params: {},
  		method: "get",
  	}).then((res) => {
		// 读取本地数据 正式换成对应服务器接口即可
		var res = databases.themeList
  		that.setData({
  			'themeList': res.data.list
  		});
  	})
  },
  
  /**
   * 快报接口
   * */
  getReportList:function(){
  	let reportUrl = app.globalData.dataUrl.reportUrl
  	var that = this
  	// 请求服务器
  	util.requestUrl({
  		url: reportUrl, //不需要域名，因为方法中已经拼接域名
  		params: {},
  		method: "get",
  	}).then((res) => {
		// 读取本地数据 正式换成对应服务器接口即可
		var res = databases.reportList
  		let reportDatas = [];
  		let reportResource = res.data
  		for (var idx in reportResource) {
  			var subject = reportResource[idx]
  			var title = subject.nickName
  			if (title.length >= 6) {
  				title = title.substring(0, 6) + "...";
  			}
  			var temp = {
  				id:subject.id,
  				nickName: title,
  				avatar: subject.avatar,
  				ntdcmoney: Number(subject.ntdcmoney),
  			}
  			reportDatas.push(temp)
  		}
  		that.setData({
  			'reportList': reportDatas
  		});
  	})
  },
  
  /**
   * 下拉加载
   * */
  onReachBottom: function(event) {
  	var currentSortId = this.getSortId(); //当前排序ID
  	var currentNavIndex = this.data.swiperNav.i //获取当前分类位置
  	var currentCateObj = this.data.swiperNav.arr //获取当前分类对象
  	var currentCateId = this.data.swiperNav.arr[currentNavIndex].cate //获取当前分类ID
  	var nextUrl = app.globalData.dataUrl.goodsList + "?cate=" + currentCateId + "&page=" + this.data.page +
  		"&supplier=pin" + "&sort=" + currentSortId
  	this.getGoodsListData(nextUrl)
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
  
  
  /** 切换分类 */
  swiperNav: function(e) {
  	var i = e.target.dataset.i;
  	this.selectCurrentClikcCates(i)
  },
  
  /**
   * 分类弹出层
   * */
  showCatModel: function(e) {
  	this.setData({
  		modelShow: true,
  		modelLocked: true
  	})
  },
  /**
   * 点击弹出层分类事件
   * */
  clickCurrentTag: function(e) {
  	var i = e.target.dataset.i;
  	this.selectCurrentClikcCates(i)
  	this.setData({
  		'modelShow': false,
  		'modelLocked': false
  	})
  },
  /**
   * 点击背景关闭 弹出层 bindModelHide
   * */
  bindModelHide:function(){
  	this.setData({
  		'modelShow': false,
  		'modelLocked': false
  	})
  },
  /** 公共点击  **/
  selectCurrentClikcCates(i) {
  	var w = wx.getSystemInfoSync().windowWidth;
  	var leng = this.data.swiperNav.arr.length;
  	var disX = (i - 2) * w / leng;
  	/** 加这个判断主要是为了，开始移动的时候始终保持当前位置*/
  	if (i >= 3) {
  		disX += i * 25;
  	}
  	if (i != this.data.swiperNav.i) {
  		this.setData({
  			'swiperNav.i': i
  		})
  	}
  	this.setData({
  		'swiperNav.x': disX,
  	})
  	this.resetPage()
  	this.resetSort()
  	this.onLoad();
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
  	this.onLoad() //重新加载页面
  },
  /**
   * 初始化排序
   * */
  resetSort: function() {
  	var resetSortObj = {
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
  	}
  	this.setData({
  		'sortList': resetSortObj
  	});
  },
  /**
   * 初始化分页
   * */
  resetPage: function() {
  	this.setData({
  		'page': 1,
  		'isEmpty': true
  	});
  },
  /**
   *  搜索框输入触发事件
   */
  onBindFocus: function(e) {
  	wx.navigateTo({
  		url: "/pages/search/search"
  	})
  },
  /** 获取详情页数据 */
  getDetail: function(e) {
  	var goodsId = e.currentTarget.dataset.goodsid
  	//判断是否授权，没有授权就跳转登录页面
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
   * 点击主题跳转
   * */
  onSwiperTap:function(e){
  	let themeid = e.target.dataset.themeid;
  	wx.navigateTo({
  	  url: "/pages/banner/banner?id="+themeid
  	})
  }
})