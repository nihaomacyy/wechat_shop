const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
var login1 = function(userInfo,callback=null){
	return "123"
	if(callback){
		callback()
	}
}
/**
 * 查询用户和订单信息方法
 * */
const getUserOrderInfo = ({openId},callback)=>{
	let getUserOrderUrl = 'https://ping.funshipin.com/api/v1/user/getUserOrderInfo'
	let header = {'content-type': 'application/json;charset=utf-8'}
	let method = 'POST'
	wx.request({
	  url: getUserOrderUrl,
	  method: method,
	  data: {openId:openId},	
	  header: header,
	  success: (res) => {
				callback(res.data.data)
	  },
	  fail: function (err) {
	  }
	})
}
/**
 * 更新用户信息
 * 
 * */
 const updateUserInfo = ({openId}) =>{
	 let getUserOrderUrl = 'https://api.weixin.qq.com'
	 let header = {'content-type': 'application/json;charset=utf-8'}
	 let method = 'POST'
	 return new Promise((resolve, reject) => {
	   wx.request({
	     url: getUserOrderUrl,
	     method: method,
	     data: {openId:openId},	
	     header: header,
	     success: (res) => {
				 if (res.statusCode !== 200) {
				   wx.showToast({
				     title: '请求出错',
				     icon: 'none',
				     duration: 2000,
				     mask: true
				   })
				 }
	   		 resolve(res)
	     },
	     fail: function (err) {
				 wx.showToast({
				   title: '网络异常',
				   icon: 'none',
				   duration: 2000,
				   mask: true
				 })
				 reject(err)
	     }
	   })
	 })
 }
/**
 * 登录授权方法
 * */
const login =({userInfo,encryptedData,signature,rawData,iv},callback) =>{
		 let regUrl = 'https://api.weixin.qq.com'
		 let method="POST"
		 let header = {'content-type': 'application/json;charset=utf-8'}
		 wx.login({
		  success: res => {
				let requestCode = res.code
		    // 请求服务器
		    wx.request({
		      url: regUrl,
		      method: method,
		      data: {code:requestCode,userInfo:userInfo,encryptedData:encryptedData,signature:signature,rawData:rawData,iv:iv},	
		      header: header,
		      success: (res) => {
						callback(res)
						//callback(res.data.data.userInfo)
		      },
		      fail: function (err) {
						wx.showToast({
						  title: '本地数据哦~',//'网络异常',
						  icon: 'none',
						  duration: 2000,
						  mask: true
						})
						callback(err)
						//callback(res.data.data.userInfo)
		      }
		    })
		  }
		})
}
/**
 * request请求
 * */
const requestUrl = ({
  url,
  params,
  success,
  method = "POST"
}) => {
  let server = 'https://api.weixin.qq.com';//测试域名
  let header = {'content-type': 'application/json;charset=utf-8'}
  return new Promise(function (resolve, reject) {
    wx.request({
      url: server + url,
      method: method,
      data: params,
      header: header,
      success: (res) => {
        if (res['statusCode'] !== 200) {
          wx.showToast({
            title: res.data.message || '请求出错',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
        resolve(res.data)
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '本地数据哦~',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        reject(res.data)
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  })
  .catch((res) => { })
}

module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  requestUrl: requestUrl,
	login:login,
	login1:login1,
	getUserOrderInfo:getUserOrderInfo,
	updateUserInfo:updateUserInfo
}
