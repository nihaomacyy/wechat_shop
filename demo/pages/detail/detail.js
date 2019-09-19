// pages/detail/detail.js
const databases = require('../../databases/databases.js')
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		goodsId:'',
		isHide:false,
		detailData:{},
		userInfo:{},
		modelShow: false, //是否显示分类弹框
		casShow:true,
		qrcode:"",
		qrcodes:"",
		quan:"../../images/icon_quan.png",
		tempFilePath:'',
		canvasWidth:'',
		canvasHeight:'',
		tgLink:'',//推广链接
		coverImg:'',//封面图
		btuBottom:'',
		coupondiscount:true,
		goodsName:""
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let goodsID = ''
		if (options.scene) {//判断一下是否是扫码过来的
			let scene = decodeURIComponent(options.scene)//share_1191237485
			//let scene = 'share_1191237485'
			let [fromName,vals] = scene.split("_")
			goodsID = vals
		}else{
			goodsID = options.id
		}
		if(options.tcode){
			wx.setStorageSync('tcode', options.tcode);
		}
		let userInfo = wx.getStorageSync('userInfo')//判断一下，缓存是否有用户信息
		
		if (userInfo == "") {
			wx.redirectTo({
				url: "/pages/login/login"+"?id="+goodsID//不村子跳转登录授权
			})
		}else{
			let isTg = userInfo.istg//用户身份标识
			if(isTg == 1){
				this.setData({
					'isHide':true
				})
			}else{
				this.setData({
					'isHide':false
				})
			}
			this.setData({
				'goodsId':goodsID,
				'userInfo':userInfo,
			})
			let detailUrl  = app.globalData.dataUrl.detailList + "?supplier=pin" + "&id=" + goodsID//获取数据
			this.getDetailData(detailUrl)
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
	// 适配iphone X
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
	let userInfo = wx.getStorageSync('userInfo')
	let path = 'pages/detail/detail?id=' + this.data.goodsId
	if(userInfo.istg == 1){
		path = 'pages/detail/detail?id=' + this.data.goodsId + "&tcode=" + userInfo.tcode
	}
	return {
		title: this.data.detailData.goods_name,
		path: path
	}
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
		// 读取本地数据 正式换成对应服务器接口即可
		var res = databases.detailList
		let imgs = res.data.goods_gallery_urls
		let coupon_discount = res.data.coupon_discount
		let goodsname = res.data.goods_name
		if (goodsname.length >= 20) {
			goodsname = goodsname.substring(0, 45);
		}
		if(imgs[0] != ""){
			that.setData({
				'coverImg':imgs[0]
			})
		}else{
			that.setData({
				'coverImg':res.data.goods_thumbnail_url
			})
		}
		if(coupon_discount == 0){
			that.setData({
				'coupondiscount':false
			})
		}else{
			that.setData({
				'coupondiscount':true
			})
		}
  		that.setData({
			'detailData':res.data,
			'goodsName':goodsname
		})
		wx.hideLoading()
  	}).catch(function(err) {
  	});
  },
  /**
   * 分享图片
   * */
  bindPreviewImage:function(e){
	    //获取你存放在服务器上的图片地址，效果就是放大到手机屏幕全屏
		//好像临时路径也可以，比如你用canvas画好的图片，也可以放大至手机全屏预览
		let currentImg = e.currentTarget.dataset.img
		wx.previewImage({
		  current: currentImg, // 当前显示图片的http链接
		  urls: [currentImg] // 需要预览的图片http链接列表
		})
  },
  /**
   * 复制文字
   * */
  bindCopyWord:function(e){
	  let text = e.currentTarget.dataset.text
	  let userInfo = wx.getStorageSync('userInfo')
	  let url = app.globalData.dataUrl.getticket+"?supplier=pin&gid="+this.data.goodsId+"&uid="+userInfo.id+"&openid="+userInfo.openid
	  // 请求服务器
	  util.requestUrl({
	  	url: url, //不需要域名，因为方法中已经拼接域名
	  	params: {},
	  	method: "get",
	  }).then((res) => {
		  //text = text+res.data.we_app_web_view_short_url
		  text = "复制测试文本"
		  // 请求成功再复制
		  wx.setClipboardData({
		  	data: text,
		  	success: function(res) {
		  	}
		  })
	  }).catch(function(err) {
	  });
  },
  /**
   * 复制链接
   * */
  bindCopyLink:function(e){
	  // 请求成功再复制
	  wx.setClipboardData({
	  	data: e.currentTarget.dataset.link,
	  	success: function(res) {
	  	}
	  })
  },
  /**
   * 生成推广链接
   * */
  generateTglink:function(){
	  var that = this
	  let userInfo = wx.getStorageSync('userInfo')
	  let url = app.globalData.dataUrl.getticket+"?supplier=pin&gid="+this.data.goodsId+"&uid="+userInfo.id+"&openid="+userInfo.openid
	  // 请求服务器
	  util.requestUrl({
	  	url: url, //不需要域名，因为方法中已经拼接域名
	  	params: {},
	  	method: "get",
	  }).then((res) => {
		  that.setData({
			  'tgLink':res.data.we_app_web_view_short_url
		  })
	  })
  },
  /**
   * bingToMiniProgram 跳转小程序 领券购买
   * */
   bingToMiniProgram:function(e){
	   let userInfo = wx.getStorageSync('userInfo')
	   let url = app.globalData.dataUrl.getticket+"?supplier=pin&gid="+this.data.goodsId+"&uid="+userInfo.id+"&openid="+userInfo.openid
	   let tcode = wx.getStorageSync('tcode')
	   if(tcode){
			url = app.globalData.dataUrl.getticket+"?supplier=pin&gid="+this.data.goodsId+"&uid="+userInfo.id+"&openid="+userInfo.openid + "&tcode=" + tcode
	   }
	   // 请求服务器
	   util.requestUrl({
	   	url: url, //不需要域名，因为方法中已经拼接域名
	   	params: {},
	   	method: "get",
	   }).then((res) => {
		   // 这里是请求你服务器接口，然后通过接口拿到，你要跳转到小程序页面路径
		   // 这种是分包路径 ("package_a/welfare_coupon/welfare_coupon?goods_id=27815116677")
		   // 正常路径是这样的 ("pages/test/test")
		   // appid 一定要在你小程序后台设置一下，不然跳不了（自行百度）
		   wx.navigateToMiniProgram({
			  appId: res.data.we_app_info.app_id,
			  path: res.data.we_app_info.page_path,
			  success(res) {
				// 打开成功
			  }
			})
	   }).catch(function(err) {
	   });
   },
   /**
	* 这个是画布上面用来给文本换行用的
	* 具体自己慢慢看
	* 文本换行
	* */
   textByteLength(text, num) {
	   // text为传入的文本  num为单行显示的字节长度
      let strLength = 0; // text byte length
      let rows = 1;
      let str = 0;
      let arr = [];
      for (let j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) > 255) {
          strLength += 2;
          if (strLength > rows * num) {
            strLength++;
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        } else {
          strLength++;
          if (strLength > rows * num) {
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        }
      }
      arr.push(text.slice(str, text.length));
      return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
    },
	/**
	 * 预览海报
	 * */
	bingShareTempImg:function(e){
		wx.canvasToTempFilePath({
		  canvasId: 'shareCanvas',
		  success(res) {
			  wx.previewImage({
			    current: res.tempFilePath, // 当前显示图片的http链接
			    urls: [res.tempFilePath] // 需要预览的图片http链接列表
			  })
		  }
		})
	},
	/**
	 * 保存图片
	 * */
	bingSaveTempImg:function(e){
		var that = this
		// 生成预览图以后再保存
		wx.canvasToTempFilePath({
		  canvasId: 'shareCanvas',
		  success(res) {
			  wx.saveImageToPhotosAlbum({
			  	filePath:res.tempFilePath,
				success:function(res){
					wx.showModal({
						title: '图片保存成功',
						content: '图片成功保存到相册了，去发圈噻~',
						showCancel: false,
						confirmText: '好哒',
						confirmColor: '#72B9C3',
						success:function(res){
						  that.setData({
							modelShow: false,
							casShow:false
						  })
						}
					})
				},
				fail:function(err){
				}
			  })
		  }
		})
	},
	bindPopup:function(){
		this.setData({
			modelShow: false,
			casShow:false
		})
	},
	/**
	 * 分享海报 全图
	 * */
	 getSystem: function () {
	   return new Promise((resolve, reject) => {
	     wx.getSystemInfo({
	       success: function (res) {
	         resolve(res)
	       },
	       fail: function () {
	         reject("")
	       }
	     })
	   })
	 },
	getImage: function (url) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url,
        success: function (res) {
          resolve(res)
        },
        fail: function (err) {
				/* wx.showModal({
					title: '提示',
					content: '111111',
					success (res) {
					}
				}) */
          reject(err)
        }
      })
    })
  },
  getImageAll: function (image_src) {
    let that = this;
    var all = [];
    image_src.map(function (item) {
      all.push(that.getImage(item))
    })
    return Promise.all(all)
  },
  /** 
   * 这里canvas是生成海报的,按照下面方法，只要更换图片就能生成预览图了
   * 所有的https://图片地址，必须要在你小程序后台download下面设置好
   * 不然发布体验版测试的时候，各种坑
   * 开发的时候没事
   * 
   * 画好海报之后，直接把临时路径保存到page data里面的变量里面，
   * 这样你就可以在任意的地方去预览你的海报了
   * 
   * 输出的时候，不要给宽高，直接拿canvasId: 'shareCanvas',
   * 什么事情都没有，不然各种屏幕适配会出问题
   * 
   * **/
	showPosterModels:function(e){
		var that = this
		// 画背景图片
		let currentImg = e.currentTarget.dataset.poster//缩略图
		let title = e.currentTarget.dataset.title//标题
		let price = e.currentTarget.dataset.price//原价
		let sprice = e.currentTarget.dataset.sprice//券后价格
		let coupondiscount = parseInt(e.currentTarget.dataset.coupondiscount)//券面额
		let remainquan = e.currentTarget.dataset.remainquan//剩余券
		let starttime = e.currentTarget.dataset.starttime//有效期开始
		let endtime = e.currentTarget.dataset.endtime//有效期结束
		
		let salestip = e.currentTarget.dataset.salestip//销量
		let currentAvator = that.data.userInfo.avatar//头像
		//let qrcode = that.data.qrcodes
		let quan = "120x40"//本地图片不可以，要远程地址,尺寸已标注
		let pinLogo = "32x32"
		let share = "700x176"
		this.generateQrcode().then(function(res){
			wx.showLoading({
				title: '合成中,请稍后...',
			})
			let qrcode = res.data
			that.setData({
				'casShow':true
			})
			// 获取手机屏幕宽高
			that.getSystem().then(function(res){
				// 此处直接采用iPhone6的比例去画，输出的时候，不要设置宽高，直接获取canvasID即可，不然适配的时候会出问题
				let screenWidth = 375//res.screenWidth 
				let screenHeight = 667//res.screenHeight
				that.setData({
					canvasWidth : 375+'px',
					canvasHeight : 667+ 'px',
					imageWidth:screenWidth + 'rpx',
					imageHeight:screenHeight + 'rpx'
				})
				that.getImageAll([currentImg,currentAvator,qrcode,share,pinLogo]).then((res) =>{
					let bg = res[0].path
					let at = res[1].path
					let qr = res[2].path
					let share = res[3].path
					let pin = res[4].path

					const ctx = wx.createCanvasContext('shareCanvas')
					ctx.drawImage(bg, 0, 0, screenWidth,screenWidth)
					
					// 画海报下半部分背景
					ctx.setFillStyle('#FFFFFF')
					ctx.fillRect(0, screenWidth, screenWidth,screenHeight-screenWidth)
					
					// 标题
					const CONTENT_ROW_LENGTH = 38; // 正文 单行显示字符长度
					let [contentLeng, contentArray, contentRows] = that.textByteLength(title, CONTENT_ROW_LENGTH);
					ctx.setTextAlign('left');
					ctx.setFillStyle('#000');
					ctx.setFontSize(17);
					//let contentHh = 25 * 1;//行距
					let contentHh = screenHeight * 0.037* 1;//行距
					let n = ''//行数
					//let marginTop = 30
					let marginTop = screenHeight * 0.044
					let marLeft = screenWidth * 0.04
					let twenty = screenHeight*0.03
					let fifteen = screenWidth * 0.04
					let forty = screenWidth*0.11
					//画平台图标
					ctx.drawImage(pin, marLeft, screenWidth+fifteen, 20, 20)
					for (let m = 0; m < contentArray.length; m++) {
						if(m == 0){
							ctx.fillText(contentArray[m], marLeft+fifteen+5, screenWidth + marginTop + contentHh * m);
						}else{
							ctx.fillText(contentArray[m], marLeft, screenWidth + marginTop + contentHh * m);
						}
						n = m
					}
					
					// 券后
					ctx.setTextAlign('left');
					ctx.setFillStyle('#E8161B');
					ctx.setFontSize(14);
					ctx.fillText("券后￥", marLeft, screenWidth+marginTop+(n+2)*contentHh);//图片高度+magin高度+标题高度（行（0+1）* 行距）
					
					// 券后价格
					ctx.setTextAlign('left');
					ctx.setFillStyle('#E8161B');
					ctx.setFontSize(24);
					ctx.fillText(sprice, marLeft+forty, screenWidth+marginTop+(n+2)*contentHh);//图片高度+magin高度+标题高度（行（0+1）* 行距）
					
					
					
					// 销量
					let marRight = screenWidth*0.92
					let salestipLength = salestip.toString().length
					ctx.setTextAlign('left');
					ctx.setFillStyle('#969696');
					ctx.setFontSize(14);
					ctx.fillText("销量 "+salestip, marRight-salestipLength*15, screenWidth+marginTop+(n+2)*contentHh);//图片高度+magin高度+标题高度（行（0+1）* 行距）
					
					// 原价
					let spriceLength = sprice.toString().length
					ctx.setTextAlign('left');
					ctx.setFillStyle('#969696');
					ctx.setFontSize(12);
					ctx.fillText("拼多多价 ￥"+price, marLeft, screenWidth+marginTop+(n+3)*contentHh);//图片高度+magin高度+标题高度（行（0+1）* 行距）
					
					// 券区域
					ctx.setFillStyle('#FFFFFF')
					ctx.fillRect(marLeft, screenWidth+marginTop+(n+4)*contentHh, screenWidth*0.92,88)
					ctx.drawImage(share, marLeft, screenWidth+marginTop+(n+4)*contentHh, screenWidth*0.92, 88)
					
					
					// 优惠券
					let coupondiscountLength = coupondiscount.toString().length
					let quanLeft = marLeft+forty
					if(coupondiscountLength == 1){
						quanLeft = marLeft+forty+coupondiscountLength*40
					}else if(coupondiscountLength == 2){
						quanLeft = marLeft+forty+coupondiscountLength*10
					}
					ctx.setTextAlign('left');
					ctx.setFillStyle('#FFFFFF');
					ctx.setFontSize(32);
					ctx.fillText(coupondiscount, quanLeft, screenWidth+marginTop+(n+6)*contentHh);//图片高度+magin高度+标题高度（行（0+1）* 行距）
					
					// 元优惠券 文字
					let hundred = screenWidth*0.27
					ctx.setTextAlign('left');
					ctx.setFillStyle('#FFFFFF');
					ctx.setFontSize(20);
					ctx.fillText("元优惠券", marLeft+hundred, screenWidth+marginTop+(n+6)*contentHh);//图片高度+magin高度+标题高度（行（0+1）* 行距）
					
					// 有效期 文字
					ctx.setTextAlign('left');
					ctx.setFillStyle('#FFFFFF');
					ctx.setFontSize(12);
					ctx.fillText("有效期"+starttime+" ～ "+endtime, marLeft+twenty, screenWidth+marginTop+(n+7)*contentHh);//图片高度+magin高度+标题高度（行（0+1）* 行距）
					
					
					// 剩余 文字
					let startEnd = "有效期"+starttime+" ～ "+endtime
					let startEndLength = startEnd.toString().length
					ctx.setTextAlign('left');
					ctx.setFillStyle('#FFFFFF');
					ctx.setFontSize(12);
					ctx.fillText("剩余 "+remainquan, marLeft+startEndLength*10, screenWidth+marginTop+(n+7)*contentHh);//图片高度+magin高度+标题高度（行（0+1）* 行距）
					
					// 画二维码
					ctx.drawImage(qr, screenWidth-hundred, screenWidth+marginTop+(n+4)*contentHh+10, 68, 68)
					ctx.draw()
					setTimeout(function() {
						// 画好生成路径
						wx.canvasToTempFilePath({
						  x: 0,
						  y: 0,
						  width: screenWidth,
						  height: screenHeight,
						  destWidth: screenWidth*2,
						  destHeight: screenHeight*2,
						  canvasId: 'shareCanvas',
						  success(res) {
							setTimeout(function () {
								wx.hideLoading()
								that.setData({
									modelShow: true,
									tempFilePath:res.tempFilePath
								})
							}, 2000)
						  },
						  fail:function(err){
						  }
						})
					}, 2000);
				})
			})
		})
	},
	/**
	 * 返回首页
	 * */
	bingHome:function(){
		wx.switchTab({
		  url: '/pages/home/home'
		})
	},
	/**
	 * 生成小程序码
	 * 
	 * */
	generateQrcode:function(){
		var that = this
		let url = app.globalData.dataUrl.getQrcodeToken + "?from=share&id=" + this.data.goodsId
		return new Promise((resolve, reject) => {
		  // 请求服务器
		  util.requestUrl({
		  	url: url, //不需要域名，因为方法中已经拼接域名
		  	params: {},
		  	method: "get",
		  }).then((res) => {
		  	/* that.setData({
		  		'qrcodes':res.data
		  	}) */
			resolve(res)
		  })
		})
	}
})