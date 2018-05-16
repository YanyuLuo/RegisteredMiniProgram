// pages/mypubinfodetail/mypubinfodetail.js
Page({

  data: {
    plist: [],
    count: 0,
    userId: '',
    actId:'',
    flag: false
  },

  onLoad: function (options) {
    var that = this
    
    this.setData({
      actId:options.actId
    })
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        that.setData({
          userId:res.data,
          actId: options.actId
        })
        //发起请求
        wx.request({
        url: 'http://192.168.43.146:8080/digital/getpiman',
        data: {
          actId:that.data.actId
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          that.setData({
            plist: res.data,
            count:res.data.length
          })
        },
        fail: function (res) {
          console.log(".....getPiManfail.....");
        }
      })
        //
      },
    })
    
  },

  onPullDownRefresh: function () {
    var that = this
    wx.request({
      url: 'http://192.168.43.146:8080/digital/getpiman',
      data: {
        actId: that.data.actId
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
        console.log(".....getPiManfail.....");
      }
    })
  },

  
  onReachBottom: function () {
    var that = this;
    that.setData({
      flag: true
    });
  },

  makeEmail:function(){
    var that = this
    wx.request({
      url: 'http://192.168.43.146:8080/digital/makeExcel',
      data: {
        actId: that.data.actId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if(res.data=='ok'){
          wx.showModal({
            title: '提示',
            content: '详细信息已经发送至您的默认邮箱！',
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '发送失败！请检查邮箱地址！',
          })
        }
      },
      fail: function (res) {
        console.log(".....makeExcelfail.....");
      }
    })
  }

  
})