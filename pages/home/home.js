var app = getApp()
Page({
  data: {
    winWidth:0,
    winHeight:0,
    imgUrls: [
      {
        link: '../../pages/infor/infor',
        mode: 'scaleToFill',
        url: 'http://r.photo.store.qq.com/psb?/V10c0WSY31mDLO/hAMnHr5pX8u.U1YflaEV.dgDY6h69ElnImmx7CsYJr0!/r/dGEBAAAAAAAA'
      }, {
        link: '../../pages/infor/infor',
        mode: 'scaleToFill',
        url: 'http://r.photo.store.qq.com/psb?/V10c0WSY31mDLO/*lhy5uZ*okuDtQYrnsoKkuY6u9diT0Ve*uOa6fNutmE!/r/dF4BAAAAAAAA'
      }, {
        link: '../../pages/infor/infor',
        mode: 'scaleToFill',
        url: 'http://r.photo.store.qq.com/psb?/V10c0WSY31mDLO/xrW0NNYLZy7A9Eu.3MGxE8S.9QQydfT*jVBui5KNPPM!/r/dEABAAAAAAAA'
      }
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,//持续时间
    noticeIconPath:'../../images/notice.png',
    userInfo: {},
    plist:[],
    mislist:[],
    flag:false
  },
  onLoad: function () {
    var page = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        page.setData({winWidth:res.windowWidth});
        page.setData({winHeight:res.windowHeight});
      },
    })
    this.setData({
             msgList: [
               { url: "url", title: "公告：签到喵小程序目前处在测试运行中 出现不稳定情况敬请谅解" },
               { url: "url", title: "公告：喵喵欢迎小伙伴们的到来~ 有任何意见或者建议记得私戳本喵哟" },
               { url: "url", title: "公告：发布签到活动需首先申请发布权限 无发布权限用户将会被限制使用发布功能" }]
           });

    var that = this;
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getnewpub',
      data: {

      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          plist: res.data
        })
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    })
    //获取本地缓存的userId
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        console.log("下面为获取本地缓存");
        console.log(res.data);
        //
        wx.request({
          url: 'http://192.168.43.146:8080/digital/getpercode',
          data: {
            userId:res.data
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            that.setData({
              mislist: res.data
            })
            wx.setStorage({
              key: 'quan',
              data: res.data,
              success:function(res){
                console.log("已获取并缓存用户权限信息")
                console.log(res);
              }
            })
            
          },
          fail: function (res) {
            console.log(".....fail.....");
          }
        })
        //
      },
    })
  },
  toCurrentAct:function(){
    wx.switchTab({
      url: '../../pages/notice/notice',
    })
    console.log("点击了参与")
  },

  toReservationAct: function () {
    wx.switchTab({
      url: '../../pages/notice/notice',
    })
  },
  fingerPrint:function(){
    /*//调用指纹验证核心代码，暂存在这
    if (wx.canIUse('checkIsSupportSoterAuthentication')) {
      wx.checkIsSupportSoterAuthentication({
        success(res) {
          if (res.supportMode[0] == 'fingerPrint') { // 写法不严谨，正确写法应该是遍历数组查找
            // 在此具体调用指纹识别
            wx.startSoterAuthentication({
              requestAuthModes: ['fingerPrint'],
              challenge: '123456',
              authContent: '请用指纹注册',
              success(res) {
                // res 中包含授权数据，需要进一步验证正确性
                wx.navigateTo({
                  url: '../mobile/mobile',
                })
              },
              fail(res) {
                console.log('用户取消了指纹识别，或调用出现错误')
              }
            })
          } else {
            console.log('当前设备不支持指纹识别')
          }
        }
      })
    }
    */
    var ispub = null
    wx.getStorage({
      key: 'quan',
      success: function(res) {
       ispub = res.data[0].pubPermission
       if (ispub == 1) {
         wx.showModal({
           title: '提示',
           content: '如果发布无效活动次数过多，将会被取消发布权限，亲填表要慎重哦',
           success:function(res){
             wx.navigateTo({
               url: '../../pages/pubact/pubact',
             })
           }
         })
       } else {
         wx.showModal({
           title: '提示',
           content: '您还没有活动发布权限，请在‘我的’菜单中申请权限！',
         })
       }
      },
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getnewpub',
      data: {
        
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          plist: res.data
        })
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    })
  },
  seeDetail:function(e){
    var that = this;
    const index = e.currentTarget.dataset.index;
    //console.log("index:"+index);
    //console.log(that.data.plist[index].actId);
    var path = "../../pages/actdetinfo/actdetinfo?actId=" + that.data.plist[index].actId ;
    //console.log(path);
    wx.navigateTo({
      url: path
    });
  },
  onReachBottom:function(){
    var that = this;
    that.setData({
      flag:true
    });
  },
  information:function(){

  }
})  