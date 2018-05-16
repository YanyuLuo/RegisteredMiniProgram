// pages/myinfo/myinfo.js
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    right: '../../images/myinfo/toright.png',
    userId:'',
    myinfo: [
      {
        icon: '../../images/myinfo/myinfo.png',
        text: '我的信息',
        path: '../../pages/myinfodetail/myinfodetail'
      }
    ],
    items: [
      {
        icon: '../../images/myinfo/yuyue.png',
        text: '已预约活动',
        path: '/pages/notice/notice'
      },
      {
        icon: '../../images/myinfo/kecanjia.png',
        text: '需参与活动',
        path: '/pages/notice/notice'
      },
      {
        icon: '../../images/myinfo/lishi.png',
        text: '历史活动',
        path: '/pages/notice/notice'
      },
      {
        icon: '../../images/myinfo/fabu.png',
        text: '发布活动',
        path: '/pages/notice/notice'
      },
      {
        icon: '../../images/myinfo/genggai.png',
        text: '更改绑定手机号',
        path: '18629027590',
      },
    ],
    settings: [
      {
        icon: '../../images/myinfo/upp.png',
        text: '发布活动权限申请',
        path: '/pages/pubreq/pubreq'
      },
      {
        icon: '../../images/myinfo/sms.png',
        text: '短信替代权限申请',
        path: '/pages/smsreq/smsreq'
      },
    ], otherinfo: [
      {
        icon: '../../images/myinfo/miao.png',
        text: '关于签到喵',
        path: '/pages/notice/notice'
      }
    ]
  },
  //事件处理函数
  bindViewTap: function () {
    //头像点击事件
    wx.navigateTo({
      url: '../../pages/myinfodetail/myinfodetail'
    })
    
    console.log("点击了头像")
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that = this
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        that.setData({
          userId:res.data
        })
      },
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  myinfoTo: function (e) {
    wx.navigateTo({
      url: '../../pages/myinfodetail/myinfodetail'
    });
  },
  navigateTo: function (e) {
    const index = e.currentTarget.dataset.index;
    const path = e.currentTarget.dataset.path;
    console.log("index:"+index);
    switch (index) {
      case 4:
        wx.makePhoneCall({
          phoneNumber: '17826856131'
        })
        break;
      default:
        console.log("忽略这个："+path);
        wx.navigateTo({
          url: '../../pages/aboutmiao/aboutmiao'
        });
    };
  },

  actTo:function(e){
    const index = e.currentTarget.dataset.index;
    const path = e.currentTarget.dataset.path;
    console.log("index:" + index);
    switch (index) {
      case 0:
        wx.navigateTo({
          url: '../../pages/myyuyue/myyuyue'
        });
        break;
      case 1:
        wx.navigateTo({
          url: '../../pages/myneedjoin/myneedjoin'
        });
        break;
      case 2:
        wx.navigateTo({
          url: '../../pages/myhistoryact/myhistoryact'
        });
        break;
      case 3:
      var ispub = null
      wx.getStorage({
        key: 'quan',
        success: function(res) {
          ispub = res.data[0].pubPermission
          if (ispub == 1){
            //跳转到我的发布界面
            wx.navigateTo({
              url: '../../pages/mypubinfo/mypubinfo'
            });
          }else{
            wx.showModal({
              title: '提示',
              content: '您还没有活动发布权限，请在‘我的’菜单中申请权限！',
            })
          }
        },
      })
        
        break;
      case 4:
        wx.navigateTo({
          url: '../../pages/reloadphone/reloadphone'
        });
        /*
        wx.makePhoneCall({
          phoneNumber: '17826856131'
        })
        */
        break;
      default:
        console.log(path);
        
    };
  },

  reqTo:function(e){
    var that = this
    const index = e.currentTarget.dataset.index;
    console.log("index:" + index);
    switch (index) {
      case 0:
        wx.getStorage({
          key: 'quan',
          success: function(res) {
            if(res.data[0].pubPermission){
              wx.showModal({
                title: '提示',
                content: '您已经有发布权限了，试试去发布吧~',
              });
            }else{
              wx.request({
                url: 'http://192.168.43.146:8080/digital/reqpub',
                data: {
                  userId:that.data.userId
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  if(res.data==true){
                    wx.showModal({
                      title: '提示',
                      content: '用户提交申请成功',
                    });
                  }
                },
                fail: function (res) {
                  console.log(".....reqPubfail.....");
                }
              })
              
            }
          },
        })
        break;
      case 1:
        wx.getStorage({
          key: 'quan',
          success: function (res) {
            if (res.data[0].fingerPrint==0) {
              wx.showModal({
                title: '提示',
                content: '您已经有短信权限了',
              });
            } else {
              wx.request({
                url: 'http://192.168.43.146:8080/digital/reqsms',
                data: {
                  userId: that.data.userId
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  if (res.data == true) {
                    wx.showModal({
                      title: '提示',
                      content: '用户提交短信权限申请成功',
                    });
                  }
                },
                fail: function (res) {
                  console.log(".....reqSmsfail.....");
                }
              })
              
            }
          },
        })
        break;
      default:
        console.log(path);
        wx.navigateTo({
          url: path
        });
    };
  }
})
