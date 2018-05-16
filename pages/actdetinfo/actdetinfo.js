// pages/actdetinfo/actdetinfo.js 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actId:'',//onload时自动设置
    userId: '',//onload时自动设置
    finger: '',//onload时自动设置
    mylat: '',//onload时自动设置
    mylng: '',//onload时自动设置
    plist:[],
    actimg:'../../images/actdetail/dushu.jpg',
    icon:{
      dname:'../../images/actdetail/dname.png',
      dtheme:'../../images/actdetail/dtheme.png',
      dloc:'../../images/actdetail/dloc.png',
      dcont:'../../images/actdetail/dcont.png',
      dtime:'../../images/actdetail/dtime.png'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      actId: options.actId
    })
    //console.log(this.data.actId);
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        that.setData({
          userId: res.data
        })
      },
    })

    wx.getStorage({
      key: 'quan',
      success: function(res) {
        that.setData({
          finger: res.data[0].fingerPrint
        })
      },
    })
    
    wx.getLocation({
      success: function(res) {
        that.setData({
          mylat:res.latitude,
          mylng:res.longitude
        })
      },
    })
    
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getactdetail',
      data: {
        actId: options.actId
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
  kantu:function(){
    //传参actId到新Map页面，由新map发起请求
    var path = '../../pages/lookmap/lookmap?actId=' + this.data.actId
    wx.navigateTo({
      url: path,
    })
  },
  yuyue:function(){
    var that = this
    //调用指纹确认预约
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
                // 发送信息到预约表，包括userId,actId
                wx.request({
                  url: 'http://192.168.43.146:8080/digital/insertyuyue',
                  data: {
                    userId:that.data.userId,
                    actId:that.data.actId
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    if(res.data=='ok'){
                      wx.showModal({
                        title: '提示',
                        content: '预约成功，亲可以在‘我的’中查看',
                      })
                    }
                    if(res.data=='done'){
                      wx.showModal({
                        title: '提示',
                        content: '您已经预约此活动，请勿重复预约',
                      })
                    }
                  },
                  fail: function (res) {
                    console.log(".....预约fail.....");
                  }
                })
                //
                
              },
              fail(res) {
                console.log('用户取消了指纹识别，或调用出现错误')
              }
            })
          } else {
            console.log('当前设备不支持指纹识别')
            //准备写入短信验证代码
            if (that.data.finger == 0) {
              //短信验证代码
              wx.request({
                url: 'http://192.168.43.146:8080/digital/smsDealTest',
                data: {
                  phone: '17826856131'
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                //设计是传过来验证码字符串
                success: function (res) {
                  that.setData({
                    checkCode: res.data
                  })
                  console.log("成功请求验证码")
                  console.log(that.data.checkCode)
                },
                fail: function (res) {
                  console.log(".....CheckCodefail.....");
                }
              })
              //
            } else {
              wx.showModal({
                title: '提示',
                content: '您的设备不支持指纹识别，您可以到“申请短信注册权限”中申请使用短信认证预约~',
              })
            }
          }
        }
      })
    }
    //
  },
  canjia:function(){
    var that = this
    //调用指纹确认预约
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
                // 发送信息到参与表，包括userId,actId,mylat,mylng
                wx.request({
                  url: 'http://192.168.43.146:8080/digital/insertcanjia',
                  data: {
                    userId: that.data.userId,
                    actId: that.data.actId,
                    myLat:that.data.mylat,
                    myLng:that.data.mylng
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    if(res.data=='ok'){
                      wx.showModal({
                        title: '提示',
                        content: '参加成功，亲可以在‘我的’中查看~',
                      })
                    }
                    if(res.data=='bad'){
                      wx.showModal({
                        title: '提示',
                        content: '注册签到失败，您不在签到有效范围内！',
                      })
                    }
                    if(res.data=='done'){
                      wx.showModal({
                        title: '提示',
                        content: '您已经参与过此活动，请勿重复参与！',
                      })
                    }
                  },
                  fail: function (res) {
                    console.log(".....参加fail.....");
                  }
                })
                //

              },
              fail(res) {
                console.log('用户取消了指纹识别，或调用出现错误')
              }
            })
          } else {
            console.log('当前设备不支持指纹识别')
            //准备写入短信验证代码
            if (that.data.finger==0){
              //短信验证代码
              wx.request({
                url: 'http://192.168.43.146:8080/digital/smsDealTest',
                data: {
                  phone: '17826856131'
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                //设计是传过来验证码字符串
                success: function (res) {
                  that.setData({
                    checkCode: res.data
                  })
                  console.log("成功请求验证码")
                  console.log(that.data.checkCode)
                },
                fail: function (res) {
                  console.log(".....CheckCodefail.....");
                }
              })
              //
            }else{
              wx.showModal({
                title: '提示',
                content: '您的设备不支持指纹识别，您可以到“申请短信注册权限”中申请使用短信认证签到~',
              })
            }
          }
        }
      })
    }
  }
})