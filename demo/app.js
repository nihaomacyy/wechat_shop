//app.js
App({
  onLaunch: function () {
    if(wx.canIUse('getUpdateManager')){
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  globalData: {
    dataUrl: {
      goodsList: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      catesList: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      searchList: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      hotsList: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      detailList: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      getticket: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      discountUrl: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      orderList: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      sendVerifSms: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      phoneRegisterUrl: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      codeRegisterUrl: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
			codesRegisterUrl: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      discountList: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      getQrcodeToken: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      themeUrl: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      themeListUrl: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      explosivelyUrl: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      contactUrl: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET", 
			activeUrl:"/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
			reportUrl:"/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
			weixinPay:"/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
			upgradeUrl:"/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
			upgradeDetailUrl:"/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
			addAddress:"/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
			getUserAddress:"/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      getUserMembers: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
      getUserInvitePoster: "/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET"
		},
    openid:'',
    userInfo: null,
    isIphoneX: false,
		upgradeFlag:'hide'
  }
})